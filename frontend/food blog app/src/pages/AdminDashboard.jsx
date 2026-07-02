import { useState, useEffect } from 'react'
import './admin.css'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import { FaUsers, FaBookOpen, FaLock, FaUnlock, FaTrash, FaSignOutAlt, FaHome, FaInfoCircle } from 'react-icons/fa'
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

    const adminToken = localStorage.getItem("adminToken")
    const adminUser = JSON.parse(localStorage.getItem("adminUser") || '{}')
    const apiUrl = API_URL

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
            
            // Update local state
            setRecipes(prevRecipes => prevRecipes.filter(recipe => recipe._id !== recipeId))
            setDeleteConfirmId(null)
        } catch (err) {
            alert(err.response?.data?.message || "Failed to delete recipe.")
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
                                <h2>Registered Users</h2>
                                <p>Manage user accounts, block or unblock access to the application.</p>
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
                                        {users.length === 0 ? (
                                            <tr>
                                                <td colSpan="5" className="empty-row">No users registered yet.</td>
                                            </tr>
                                        ) : (
                                            users.map((user, index) => (
                                                <tr key={user._id}>
                                                    <td>{index + 1}</td>
                                                    <td className="user-email">{user.email}</td>
                                                    <td>{new Date(user.createdAt).toLocaleDateString()}</td>
                                                    <td>
                                                        <span className={`status-badge ${user.blocked ? 'blocked' : 'active'}`}>
                                                            {user.blocked ? 'Blocked' : 'Active'}
                                                        </span>
                                                    </td>
                                                    <td style={{ textAlign: 'center' }}>
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
                                                    </td>
                                                </tr>
                                            ))
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    ) : (
                        /* Recipes Grid */
                        <div className="data-card" id="section-recipes">
                            <div className="data-card-header">
                                <h2>Recipe Catalogue</h2>
                                <p>Remove recipe items that violate community guidelines or contain inappropriate content.</p>
                            </div>
                            <div className="admin-recipes-grid">
                                {recipes.length === 0 ? (
                                    <div className="empty-grid-msg">No recipes found in the database.</div>
                                ) : (
                                    recipes.map((recipe) => (
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
                        </div>
                    )}
                </section>
            </main>

            {/* Delete Confirmation Modal */}
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
        </div>
    )
}
