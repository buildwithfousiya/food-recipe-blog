const express = require("express")
const router = express.Router()
const { getRecipes, getRecipe, addRecipe, updateRecipe, deleteRecipe, upload } = require("../controller/recipe")
const verifyToken = require("../middleware/auth")

router.get("/", getRecipes) // get all recipes
router.get("/:id", getRecipe) //get recipe by id
router.post("/", upload.single("file"), verifyToken, addRecipe) //add recipe
router.put("/:id", verifyToken, updateRecipe) //update recipe
router.delete("/:id", verifyToken, deleteRecipe) //delete recipe

module.exports = router