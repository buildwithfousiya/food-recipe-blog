import { useState } from 'react'
import './admin.css'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'
import { API_URL } from '../config'

export default function AdminLogin() {
    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')
    const [error, setError] = useState('')
    const [loading, setLoading] = useState(false)
    const navigate = useNavigate()

    const handleLogin = async (e) => {
        e.preventDefault()
        if (!username.trim() || !password.trim()) {
            setError("All fields are required.")
            return
        }

        setError('')
        setLoading(true)

        try {
            const apiUrl = API_URL
            const response = await axios.post(`${apiUrl}/admin/login`, { username, password })
            
            localStorage.setItem("adminToken", response.data.token)
            localStorage.setItem("adminUser", JSON.stringify(response.data.admin))

            navigate("/admin/dashboard")
        } catch (err) {
            setError(err.response?.data?.error || err.response?.data?.message || "Invalid credentials or server error.")
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="admin-login-container">
            <div className="admin-login-card">
                <h2>Admin Portal</h2>
                <p className="subtitle">Sign in to manage users and recipes</p>
                
                <form onSubmit={handleLogin} className="admin-form">
                    <div className="form-group">
                        <label htmlFor="username">Username</label>
                        <input
                            type="text"
                            id="username"
                            className="admin-input"
                            placeholder="Enter admin username"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            disabled={loading}
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="password">Password</label>
                        <input
                            type="password"
                            id="password"
                            className="admin-input"
                            placeholder="Enter admin password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            disabled={loading}
                        />
                    </div>

                    {error && <div className="admin-error-message">{error}</div>}

                    <button type="submit" className="admin-login-btn" disabled={loading}>
                        {loading ? "Signing in..." : "Sign In"}
                    </button>
                </form>
                <div className="back-to-home">
                    <span onClick={() => navigate("/")}>&larr; Back to Food Blog</span>
                </div>
            </div>
        </div>
    )
}
