import { useState, useEffect } from 'react'
import './admin.css'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import { FaUsers, FaBookOpen, FaLock, FaUnlock, FaTrash, FaSignOutAlt, FaHome, FaInfoCircle, FaSearch, FaTimes, FaChevronLeft, FaChevronRight } from 'react-icons/fa'
import { API_URL } from '../config'

export default function AdminDashboard() {
    const navigate = useNavigate()
    const [users, setUsers] = useState([])
    const [recipes, setRecipes] = useState([])
    const [activeTab, setActiveTab] = useState('users') // 'users' or 'recipes'

    const [loading, setLoading] = useState(true)
    const [error, setError] = useState('')
    const [actionLoading, setActionLoading] = useState(null) // ID of item being modified
    const [deleteConfirmId, setDeleteConfirmId] = useState(null)
    const [deleteUserConfirmId, setDeleteUserConfirmId] = useState(null)

    // Search and pagination state
    const [userSearchQuery, setUserSearchQuery] = useState('')
    const [debouncedUserSearchQuery, setDebouncedUserSearchQuery] = useState('')
    const [recipeSearchQuery, setRecipeSearchQuery] = useState('')
    const [debouncedRecipeSearchQuery, setDebouncedRecipeSearchQuery] = useState('')

    const [userCurrentPage, setUserCurrentPage] = useState(1)
    const [recipeCurrentPage, setRecipeCurrentPage] = useState(1)

    const USERS_PER_PAGE = 8
    const RECIPES_PER_PAGE = 8

    const adminToken = localStorage.getItem("adminToken")
    const adminUser = JSON.parse(localStorage.getItem("adminUser") || '{}')
    const apiUrl = API_URL

    // Debounce user search input
    useEffect(() => {
        const handler = setTimeout(() => {
            setDebouncedUserSearchQuery(userSearchQuery)
            setUserCurrentPage(1)
        }, 300)
        return () => clearTimeout(handler)
    }, [userSearchQuery])

    // Debounce recipe search input
    useEffect(() => {
        const handler = setTimeout(() => {
            setDebouncedRecipeSearchQuery(recipeSearchQuery)
            setRecipeCurrentPage(1)
        }, 300)
        return () => clearTimeout(handler)
    }, [recipeSearchQuery])

    // Reset pagination when active tab changes
    useEffect(() => {
        setUserCurrentPage(1)
        setRecipeCurrentPage(1)
    }, [activeTab])

    useEffect(() => {
        if (!adminToken) {
            navigate("/admin")
            return
        }
        fetchData()
    }, [adminToken, navigate])

    const fetchData = async () => {
        setLoading(true)
        setError('')
        try {
            const headers = { Authorization: `Bearer ${adminToken}` }
            const [usersRes, recipesRes] = await Promise.all([
                axios.get(`${apiUrl}/admin/users`, { headers }),
                axios.get(`${apiUrl}/recipe`)
            ])
            setUsers(usersRes.data)
            setRecipes(recipesRes.data)
        } catch (err) {
            setError(err.response?.data?.message || "Failed to load dashboard data.")
            if (err.response?.status === 401 || err.response?.status === 403) {
                // Token invalid or expired
                localStorage.removeItem("adminToken")
                localStorage.removeItem("adminUser")
                navigate("/admin")
            }
        } finally {
            setLoading(false)
        }
    }

    const handleToggleBlock = async (userId, currentBlockedStatus) => {
        setActionLoading(userId)
        try {
            const headers = { Authorization: `Bearer ${adminToken}` }
            await axios.patch(`${apiUrl}/admin/users/${userId}/block`, { blocked: !currentBlockedStatus }, { headers })
            
            // Update local state
            setUsers(prevUsers => prevUsers.map(user => 
                user._id === userId ? { ...user, blocked: !currentBlockedStatus } : user
            ))
        } catch (err) {
            alert(err.response?.data?.message || "Failed to update user status.")
        } finally {
            setActionLoading(null)
        }
    }

    const handleDeleteRecipe = async (recipeId) => {
        setActionLoading(recipeId)
        try {
            const headers = { Authorization: `Bearer ${adminToken}` }
            await axios.delete(`${apiUrl}/admin/recipes/${recipeId}`, { headers })
            setRecipes(prevRecipes => prevRecipes.filter(recipe => recipe._id !== recipeId))
            setDeleteConfirmId(null)
        } catch (err) {
            alert(err.response?.data?.message || "Failed to delete recipe.")
        } finally {
            setActionLoading(null)
        }
    }

    const handleDeleteUser = async (userId) => {
        setActionLoading(userId)
        try {
            const headers = { Authorization: `Bearer ${adminToken}` }
            await axios.delete(`${apiUrl}/admin/users/${userId}`, { headers })
            setUsers(prevUsers => prevUsers.filter(user => user._id !== userId))
            setDeleteUserConfirmId(null)
        } catch (err) {
            alert(err.response?.data?.message || "Failed to delete user.")
        } finally {
            setActionLoading(null)
        }
    }

    const handleLogout = () => {
        localStorage.removeItem("adminToken")
        localStorage.removeItem("adminUser")
        navigate("/admin")
    }

    // Stats
    const totalUsers = users.length
    const blockedUsersCount = users.filter(u => u.blocked).length
    const activeUsersCount = totalUsers - blockedUsersCount
    const totalRecipes = recipes.length

    // Filtering users
    const filteredUsers = users.filter(user => 
        user.email?.toLowerCase().includes(debouncedUserSearchQuery.toLowerCase())
    )

    // Filtering recipes (by title or ingredients)
    const filteredRecipes = recipes.filter(recipe => {
        const query = debouncedRecipeSearchQuery.toLowerCase()
        const titleMatch = recipe.title?.toLowerCase().includes(query)
        const ingredientsMatch = Array.isArray(recipe.ingredients)
            ? recipe.ingredients.some(ing => ing.toLowerCase().includes(query))
            : typeof recipe.ingredients === 'string'
                ? recipe.ingredients.toLowerCase().includes(query)
                : false
        return titleMatch || ingredientsMatch
    })

    // Slicing/Pagination for Users
    const totalUserPages = Math.ceil(filteredUsers.length / USERS_PER_PAGE)
    const paginatedUsers = filteredUsers.slice(
        (userCurrentPage - 1) * USERS_PER_PAGE,
        userCurrentPage * USERS_PER_PAGE
    )

    // Slicing/Pagination for Recipes
    const totalRecipePages = Math.ceil(filteredRecipes.length / RECIPES_PER_PAGE)
    const paginatedRecipes = filteredRecipes.slice(
        (recipeCurrentPage - 1) * RECIPES_PER_PAGE,
        recipeCurrentPage * RECIPES_PER_PAGE
    )

    // Handle page out-of-bounds on deletion/filtering
    useEffect(() => {
        if (totalUserPages > 0 && userCurrentPage > totalUserPages) {
            setUserCurrentPage(totalUserPages)
        }
    }, [totalUserPages, userCurrentPage])

    useEffect(() => {
        if (totalRecipePages > 0 && recipeCurrentPage > totalRecipePages) {
            setRecipeCurrentPage(totalRecipePages)
        }
    }, [totalRecipePages, recipeCurrentPage])

    if (!adminToken) return null

    return (
        <div className="admin-dashboard">
            {/* Sidebar */}
            <aside className="admin-sidebar">
                <div className="sidebar-brand">
                    <h2>Foodie Admin</h2>
                    <span>Welcome, {adminUser.username || 'Admin'}</span>
                </div>
                <nav className="sidebar-nav">
                    <button 
                        className={`nav-item ${activeTab === 'users' ? 'active' : ''}`}
                        onClick={() => setActiveTab('users')}
                    >
                        <FaUsers /> Users List
                    </button>
                    <button 
                        className={`nav-item ${activeTab === 'recipes' ? 'active' : ''}`}
                        onClick={() => setActiveTab('recipes')}
                    >
                        <FaBookOpen /> Manage Recipes
                    </button>
                    <button className="nav-item home-link" onClick={() => navigate("/")}>
                        <FaHome /> Visit Site
                    </button>
                </nav>
                <div className="sidebar-footer">
                    <button className="logout-btn" onClick={handleLogout}>
                        <FaSignOutAlt /> Sign Out
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <main className="admin-main">
                <header className="admin-header">
                    <h1>Dashboard</h1>
                    <div className="admin-profile">
                        <span className="badge-admin">Super Admin</span>
                    </div>
                </header>

                {error && (
                    <div className="admin-error-banner">
                        <FaInfoCircle /> {error}
                    </div>
                )}

                {/* Stats Grid */}
                <section className="stats-grid">
                    <div className="stat-card">
                        <div className="stat-icon users-bg"><FaUsers /></div>
                        <div className="stat-details">
                            <h3>Total Users</h3>
                            <p className="stat-number">{loading ? '...' : totalUsers}</p>
                        </div>
                    </div>
                    <div className="stat-card">
                        <div className="stat-icon active-bg"><FaUnlock /></div>
                        <div className="stat-details">
                            <h3>Active Users</h3>
                            <p className="stat-number">{loading ? '...' : activeUsersCount}</p>
                        </div>
                    </div>
                    <div className="stat-card">
                        <div className="stat-icon blocked-bg"><FaLock /></div>
                        <div className="stat-details">
                            <h3>Blocked Users</h3>
                            <p className="stat-number">{loading ? '...' : blockedUsersCount}</p>
                        </div>
                    </div>
                    <div className="stat-card">
                        <div className="stat-icon recipes-bg"><FaBookOpen /></div>
                        <div className="stat-details">
                            <h3>Total Recipes</h3>
                            <p className="stat-number">{loading ? '...' : totalRecipes}</p>
                        </div>
                    </div>
                </section>

                {/* Data Section */}
                <section className="data-section">
                    {loading ? (
                        <div className="admin-loading-spinner">
                            <div className="spinner"></div>
                            <p>Loading records...</p>
                        </div>
                    ) : activeTab === 'users' ? (
                        /* Users Table */
                        <div className="data-card" id="section-users">
                            <div className="data-card-header">
                                <div className="header-text">
                                    <h2>Registered Users</h2>
                                    <p>Manage user accounts, block or unblock access to the application.</p>
                                </div>
                                <div className="admin-search-wrapper">
                                    <FaSearch className="admin-search-icon" />
                                    <input
                                        type="text"
                                        placeholder="Search users by email..."
                                        value={userSearchQuery}
                                        onChange={(e) => setUserSearchQuery(e.target.value)}
                                        className="admin-search-input"
                                    />
                                    {userSearchQuery && (
                                        <button className="admin-search-clear" onClick={() => setUserSearchQuery('')} title="Clear search">
                                            <FaTimes />
                                        </button>
                                    )}
                                </div>
                            </div>
                            <div className="table-responsive">
                                <table className="admin-table">
                                    <thead>
                                        <tr>
                                            <th>#</th>
                                            <th>Email</th>
                                            <th>Joined Date</th>
                                            <th>Status</th>
                                            <th style={{ textAlign: 'center' }}>Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {filteredUsers.length === 0 ? (
                                            <tr>
                                                <td colSpan="5" className="empty-row">
                                                    {debouncedUserSearchQuery 
                                                        ? `No users found matching "${debouncedUserSearchQuery}".` 
                                                        : "No users registered yet."}
                                                </td>
                                            </tr>
                                        ) : (
                                            paginatedUsers.map((user, index) => (
                                                <tr key={user._id}>
                                                    <td>{(userCurrentPage - 1) * USERS_PER_PAGE + index + 1}</td>
                                                    <td className="user-email">{user.email}</td>
                                                    <td>{new Date(user.createdAt).toLocaleDateString()}</td>
                                                    <td>
                                                        <span className={`status-badge ${user.blocked ? 'blocked' : 'active'}`}>
                                                            {user.blocked ? 'Blocked' : 'Active'}
                                                        </span>
                                                    </td>
                                                    <td style={{ textAlign: 'center' }}>
                                                        <div style={{ display: 'flex', gap: '8px', justifyContent: 'center' }}>
                                                            <button
                                                                onClick={() => handleToggleBlock(user._id, user.blocked)}
                                                                disabled={actionLoading === user._id}
                                                                className={`btn-action ${user.blocked ? 'btn-unblock' : 'btn-block'}`}
                                                            >
                                                                {actionLoading === user._id ? (
                                                                    'Updating...'
                                                                ) : user.blocked ? (
                                                                    <><FaUnlock /> Unblock</>
                                                                ) : (
                                                                    <><FaLock /> Block</>
                                                                )}
                                                            </button>
                                                            <button
                                                                onClick={() => setDeleteUserConfirmId(user._id)}
                                                                disabled={actionLoading === user._id}
                                                                className="btn-action btn-delete-user"
                                                            >
                                                                <FaTrash /> Delete
                                                            </button>
                                                        </div>
                                                    </td>
                                                </tr>
                                            ))
                                        )}
                                    </tbody>
                                </table>
                            </div>
                            
                            {/* Users Pagination */}
                            {totalUserPages > 1 && (
                                <div className="admin-pagination">
                                    <span className="pagination-info">
                                        Showing {Math.min((userCurrentPage - 1) * USERS_PER_PAGE + 1, filteredUsers.length)} to {Math.min(userCurrentPage * USERS_PER_PAGE, filteredUsers.length)} of {filteredUsers.length} users
                                    </span>
                                    <div className="pagination-buttons">
                                        <button 
                                            disabled={userCurrentPage === 1}
                                            onClick={() => setUserCurrentPage(prev => Math.max(prev - 1, 1))}
                                            className="pagination-btn"
                                            title="Previous Page"
                                        >
                                            <FaChevronLeft />
                                        </button>
                                        {Array.from({ length: totalUserPages }, (_, i) => i + 1).map(page => (
                                            <button
                                                key={page}
                                                onClick={() => setUserCurrentPage(page)}
                                                className={`pagination-btn ${userCurrentPage === page ? 'active' : ''}`}
                                            >
                                                {page}
                                            </button>
                                        ))}
                                        <button 
                                            disabled={userCurrentPage === totalUserPages}
                                            onClick={() => setUserCurrentPage(prev => Math.min(prev + 1, totalUserPages))}
                                            className="pagination-btn"
                                            title="Next Page"
                                        >
                                            <FaChevronRight />
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>
                    ) : (
                        /* Recipes Grid */
                        <div className="data-card" id="section-recipes">
                            <div className="data-card-header">
                                <div className="header-text">
                                    <h2>Recipe Catalogue</h2>
                                    <p>Remove recipe items that violate community guidelines or contain inappropriate content.</p>
                                </div>
                                <div className="admin-search-wrapper">
                                    <FaSearch className="admin-search-icon" />
                                    <input
                                        type="text"
                                        placeholder="Search recipes by title or ingredients..."
                                        value={recipeSearchQuery}
                                        onChange={(e) => setRecipeSearchQuery(e.target.value)}
                                        className="admin-search-input"
                                    />
                                    {recipeSearchQuery && (
                                        <button className="admin-search-clear" onClick={() => setRecipeSearchQuery('')} title="Clear search">
                                            <FaTimes />
                                        </button>
                                    )}
                                </div>
                            </div>
                            <div className="admin-recipes-grid">
                                {filteredRecipes.length === 0 ? (
                                    <div className="empty-grid-msg">
                                        {debouncedRecipeSearchQuery 
                                            ? `No recipes found matching "${debouncedRecipeSearchQuery}".` 
                                            : "No recipes found in the database."}
                                    </div>
                                ) : (
                                    paginatedRecipes.map((recipe) => (
                                        <div key={recipe._id} className="admin-recipe-card">
                                            <div className="recipe-card-img-wrapper">
                                                <img
                                                    src={recipe.coverImage?.startsWith("http") ? recipe.coverImage : `${apiUrl}/images/${recipe.coverImage}`}
                                                    alt={recipe.title}
                                                    onError={(e) => {
                                                        e.target.src = 'https://images.unsplash.com/photo-1495521821757-a1efb6729352?q=80&w=300&auto=format&fit=crop'
                                                    }}
                                                />
                                            </div>
                                            <div className="recipe-card-content">
                                                <h3>{recipe.title}</h3>
                                                <p className="recipe-time">Cooking Time: {recipe.time || 'N/A'}</p>
                                                <button
                                                    onClick={() => setDeleteConfirmId(recipe._id)}
                                                    disabled={actionLoading === recipe._id}
                                                    className="btn-delete-recipe"
                                                >
                                                    <FaTrash /> Remove Recipe
                                                </button>
                                            </div>
                                        </div>
                                    ))
                                )}
                            </div>

                            {/* Recipes Pagination */}
                            {totalRecipePages > 1 && (
                                <div className="admin-pagination">
                                    <span className="pagination-info">
                                        Showing {Math.min((recipeCurrentPage - 1) * RECIPES_PER_PAGE + 1, filteredRecipes.length)} to {Math.min(recipeCurrentPage * RECIPES_PER_PAGE, filteredRecipes.length)} of {filteredRecipes.length} recipes
                                    </span>
                                    <div className="pagination-buttons">
                                        <button 
                                            disabled={recipeCurrentPage === 1}
                                            onClick={() => setRecipeCurrentPage(prev => Math.max(prev - 1, 1))}
                                            className="pagination-btn"
                                            title="Previous Page"
                                        >
                                            <FaChevronLeft />
                                        </button>
                                        {Array.from({ length: totalRecipePages }, (_, i) => i + 1).map(page => (
                                            <button
                                                key={page}
                                                onClick={() => setRecipeCurrentPage(page)}
                                                className={`pagination-btn ${recipeCurrentPage === page ? 'active' : ''}`}
                                            >
                                                {page}
                                            </button>
                                        ))}
                                        <button 
                                            disabled={recipeCurrentPage === totalRecipePages}
                                            onClick={() => setRecipeCurrentPage(prev => Math.min(prev + 1, totalRecipePages))}
                                            className="pagination-btn"
                                            title="Next Page"
                                        >
                                            <FaChevronRight />
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>
                    )}
                </section>
            </main>

            {/* Delete Recipe Confirmation Modal */}
            {deleteConfirmId && (
                <div className="admin-modal-overlay">
                    <div className="admin-modal">
                        <h3>Confirm Deletion</h3>
                        <p>Are you sure you want to remove this recipe? This action is permanent and cannot be undone.</p>
                        <div className="admin-modal-actions">
                            <button
                                className="modal-btn-cancel"
                                onClick={() => setDeleteConfirmId(null)}
                                disabled={actionLoading}
                            >
                                Cancel
                            </button>
                            <button
                                className="modal-btn-confirm"
                                onClick={() => handleDeleteRecipe(deleteConfirmId)}
                                disabled={actionLoading}
                            >
                                {actionLoading === deleteConfirmId ? "Deleting..." : "Delete Permanently"}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Delete User Confirmation Modal */}
            {deleteUserConfirmId && (
                <div className="admin-modal-overlay">
                    <div className="admin-modal">
                        <h3>Delete User Account</h3>
                        <p>Are you sure you want to permanently delete this user? All their data will be removed and this action <strong>cannot be undone</strong>.</p>
                        <div className="admin-modal-actions">
                            <button
                                className="modal-btn-cancel"
                                onClick={() => setDeleteUserConfirmId(null)}
                                disabled={actionLoading}
                            >
                                Cancel
                            </button>
                            <button
                                className="modal-btn-confirm"
                                onClick={() => handleDeleteUser(deleteUserConfirmId)}
                                disabled={actionLoading}
                            >
                                {actionLoading === deleteUserConfirmId ? "Deleting..." : "Delete User"}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}
