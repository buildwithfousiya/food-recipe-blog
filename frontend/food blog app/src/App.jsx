import React from 'react'
import './App.css'
import { createBrowserRouter, RouterProvider } from "react-router-dom"
import Home from './pages/Home'
import MainNavigation from './components/MainNavigation'
import axios from 'axios'
import AddFoodRecipe from './pages/addFoodRecipe'

const getAllRecipes = async () => {
  const res = await axios.get("http://localhost:5000/recipe");
  return res.data;
}

const router = createBrowserRouter([
  {
    path: "/", element: <MainNavigation />, children: [
      { path: "/", element: <Home />, loader: getAllRecipes },
      { path: "/myRecipe", element: <Home /> },
      { path: "/favRecipe", element: <Home /> },
      { path: "/addRecipe", element: <AddFoodRecipe /> }
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
