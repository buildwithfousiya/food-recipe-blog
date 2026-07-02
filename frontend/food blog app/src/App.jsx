import axios from 'axios'
import { createBrowserRouter, RouterProvider } from "react-router-dom"
import './App.css'
import MainNavigation from './components/MainNavigation'
import AddFoodRecipe from './pages/addFoodRecipe'
import EditRecipe from './pages/editRecipe'
import Home from './pages/Home'
import RecipeDetails from './pages/recipeDetails'
import NotFound from './pages/NotFound'
import AdminLogin from './pages/AdminLogin'
import AdminDashboard from './pages/AdminDashboard'
import { getAllRecipes, getMyRecipe, getFavRecipes, getRecipe } from './utils/loaders'

axios.interceptors.response.use(
  (response) => response,
  (error) => {
    if (
      error.response &&
      ((error.response.status === 403 && error.response.data?.message === "Your account is blocked by the admin.") ||
       (error.response.status === 401 && error.response.data?.message === "User account not found") ||
       (error.response.status === 400 && error.response.data?.message === "Invalid token"))
    ) {
      localStorage.removeItem("token")
      localStorage.removeItem("user")
      window.location.href = "/"
    }
    return Promise.reject(error)
  }
)
function RootFallback() {
  return (
    <div className="container">
      <div className="btn-spinner" style={{ width: '32px', height: '32px', borderColor: 'rgba(0, 168, 132, 0.2)', borderTopColor: '#00a884', borderWidth: '3px' }}></div>
    </div>
  )
}

const router = createBrowserRouter([
  {
    path: "/", 
    element: <MainNavigation />, 
    hydrateFallbackElement: <RootFallback />,
    children: [
      { path: "/", element: <Home />, loader: getAllRecipes },
      { path: "/myRecipe", element: <Home />, loader: getMyRecipe },
      { path: "/favRecipe", element: <Home />, loader: getFavRecipes },
      { path: "/addRecipe", element: <AddFoodRecipe /> },
      { path: "/editRecipe/:id", element: <EditRecipe /> },
      { path: "/recipe/:id", element: <RecipeDetails />, loader: getRecipe },
      { path: "*", element: <NotFound /> }
    ]
  },
  {
    path: "/admin", element: <AdminLogin />
  },
  {
    path: "/admin/dashboard", element: <AdminDashboard />
  }

])
export default function App() {
  return (
    <>
      <RouterProvider router={router} />
    </>
  )
}
