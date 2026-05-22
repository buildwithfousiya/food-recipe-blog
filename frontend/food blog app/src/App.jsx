import axios from 'axios'
import { createBrowserRouter, RouterProvider } from "react-router-dom"
import './App.css'
import MainNavigation from './components/MainNavigation'
import AddFoodRecipe from './pages/addFoodRecipe'
import EditRecipe from './pages/editRecipe'
import Home from './pages/Home'
import RecipeDetails from './pages/recipeDetails'

const getAllRecipes = async () => {
  let allRecipes = []
  await axios.get("http://localhost:5000/recipe").then(res => {
    allRecipes = res.data
  })
  return allRecipes
}

const getMyRecipe = async () => {
  let user = JSON.parse(localStorage.getItem("user"))
  let allRecipes = await getAllRecipes()
  return user ? allRecipes.filter(item => item.createdBy === user._id) : []
}

const getFavRecipes = () => {
  let user = JSON.parse(localStorage.getItem("user"))
  let favKey = user ? `fav_${user._id}` : "fav"
  return JSON.parse(localStorage.getItem(favKey)) ?? []
}

const getRecipe = async ({ params }) => {
  let recipe;
  await axios.get(`http://localhost:5000/recipe/${params.id}`)
    .then(res => recipe = res.data)

  await axios.get(`http://localhost:5000/user/${recipe.createdBy}`)
    .then(res => {
      recipe = { ...recipe, email: res.data.email }
    })

  return recipe
}

const router = createBrowserRouter([
  {
    path: "/", element: <MainNavigation />, children: [
      { path: "/", element: <Home />, loader: getAllRecipes },
      { path: "/myRecipe", element: <Home />, loader: getMyRecipe },
      { path: "/favRecipe", element: <Home />, loader: getFavRecipes },
      { path: "/addRecipe", element: <AddFoodRecipe /> },
      { path: "/editRecipe/:id", element: <EditRecipe /> },
      { path: "/recipe/:id", element: <RecipeDetails />, loader: getRecipe }
    ]
  }

])
export default function App() {
  return (
    <>
      <RouterProvider router={router} />
    </>
  )
}
