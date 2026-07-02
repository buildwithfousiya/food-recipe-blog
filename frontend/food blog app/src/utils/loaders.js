import axios from 'axios'
import { API_URL } from '../config'

export const getAllRecipes = async () => {
  let allRecipes = []
  await axios.get(`${API_URL}/recipe`).then(res => {
    allRecipes = res.data
  })
  return allRecipes
}

export const getMyRecipe = async () => {
  let user = JSON.parse(localStorage.getItem("user"))
  let allRecipes = await getAllRecipes()
  return user ? allRecipes.filter(item => item.createdBy === user._id) : []
}

export const getFavRecipes = () => {
  let user = JSON.parse(localStorage.getItem("user"))
  let favKey = user ? `fav_${user._id}` : "fav"
  return JSON.parse(localStorage.getItem(favKey)) ?? []
}

export const getRecipe = async ({ params }) => {
  let recipe;
  await axios.get(`${API_URL}/recipe/${params.id}`)
    .then(res => recipe = res.data)

  await axios.get(`${API_URL}/user/${recipe.createdBy}`)
    .then(res => {
      recipe = { ...recipe, email: res.data.email }
    })

  return recipe
}
