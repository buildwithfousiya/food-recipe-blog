const express = require("express")
const router = express.Router()
const { getRecipes, getRecipe, addRecipe, updateRecipe, deleteRecipe, upload } = require("../controller/recipe")
const verifyToken = require("../middleware/auth")

router.get("/", getRecipes) 
router.get("/:id", getRecipe) 
router.post("/", upload.single("file"), verifyToken, addRecipe) 
router.put("/:id", upload.single("file"),verifyToken, updateRecipe) 
router.delete("/:id", verifyToken, deleteRecipe) 

module.exports = router
