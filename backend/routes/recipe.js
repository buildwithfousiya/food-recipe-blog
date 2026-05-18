const express = require("express")
const router = express.Router()
const { getRecipes, getRecipe, addRecipe, updateRecipe, deleteRecipe, upload } = require("../controller/recipe")

router.get("/", getRecipes) // get all recipes
router.get("/:id", getRecipe) //get recipe by id
router.post("/", upload.single("file"), addRecipe) //add recipe
router.put("/:id", updateRecipe) //update recipe
router.delete("/:id", deleteRecipe) //delete recipe

module.exports = router