import { useEffect } from 'react'
import { Outlet, useLocation, useNavigate } from 'react-router-dom'
import Navbar from './navbar'
import Footer from './Footer'

export default function MainNavigation() {
  const navigate = useNavigate()
  const location = useLocation()

  useEffect(() => {
    const token = localStorage.getItem("token")
    const protectedRoutes = ["/myRecipe", "/favRecipe", "/addRecipe"]
    const isEditRoute = location.pathname.startsWith("/editRecipe/")

    if (!token && (protectedRoutes.includes(location.pathname) || isEditRoute)) {
      navigate("/")
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
