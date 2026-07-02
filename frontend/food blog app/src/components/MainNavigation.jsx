import { useEffect } from 'react'
import { Outlet, useLocation, useNavigate } from 'react-router-dom'
import Footer from './Footer'
import Navbar from './navbar'
import axios from 'axios'
import { API_URL } from '../config'

export default function MainNavigation() {
  const navigate = useNavigate()
  const location = useLocation()

  useEffect(() => {
    const token = localStorage.getItem("token")
    const protectedRoutes = ["/myRecipe", "/favRecipe", "/addRecipe"]
    const isEditRoute = location.pathname.startsWith("/editRecipe/")

    if (!token && (protectedRoutes.includes(location.pathname) || isEditRoute)) {
      navigate("/")
      return
    }

    if (token) {
      const checkStatus = async () => {
        try {
          await axios.get(`${API_URL}/check-status`, {
            headers: {
              authorization: 'bearer ' + token
            }
          })
        } catch (error) {
          console.error("Auth check failed", error)
        }
      }

      checkStatus()
      const interval = setInterval(checkStatus, 5000)
      return () => clearInterval(interval)
    }
  }, [location.pathname, navigate])

  return (
    <>
      <Navbar />
      <Outlet />
      <Footer />
    </>
  )
}
