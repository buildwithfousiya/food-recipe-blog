const Recipes = require("../models/recipe")
const multer  = require('multer')
const cloudinary = require("../config/cloudinary")

const storage = multer.memoryStorage()

const upload = multer({ storage: storage })

const getRecipes = async (req, res) => {
    const recipes = await Recipes.find()
    return res.json(recipes)
}

const getRecipe = async (req, res) => {
    const recipe = await Recipes.findById(req.params.id)
    return res.json(recipe)
} 

const addRecipe = async (req, res) => {
    const { title, ingredients, instructions, time } = req.body

    if (!title || !ingredients || !instructions) {
        return res.status(400).json({ message: "Please provide title, ingredients and instructions" })
    }

    try {
        let coverImage = ""
        if (req.file) {
            const result = await cloudinary.uploader.upload(
                `data:${req.file.mimetype};base64,${req.file.buffer.toString("base64")}`,
                {
                    folder: "recipes",
                }
            )
            coverImage = result.secure_url
        }

        const newRecipe = await Recipes.create({
            title,
            ingredients,
            instructions,
            time,
            coverImage,
            createdBy: req.user.id
        })
        return res.json(newRecipe)
    } catch (error) {
        return res.status(500).json({ message: error.message })
    }
}

const updateRecipe = async (req, res) => {
    const { title, ingredients, instructions, time } = req.body
    try {
        let recipe = await Recipes.findById(req.params.id)
        if (recipe) {
            let coverImage = recipe.coverImage
            if (req.file) {
                const result = await cloudinary.uploader.upload(
                    `data:${req.file.mimetype};base64,${req.file.buffer.toString("base64")}`,
                    {
                        folder: "recipes",
                    }
                )
                coverImage = result.secure_url
            }
            await Recipes.findByIdAndUpdate(req.params.id, { ...req.body, coverImage }, { new: true })
            return res.json({ title, ingredients, instructions, time })
        } else {
            return res.status(404).json({ message: "Recipe not found" })
        }
    } catch (error) {
        return res.status(500).json({ message: error.message })
    }
}

const deleteRecipe = async(req, res) => {
    try{
        await Recipes.deleteOne({_id:req.params.id})
        return res.json({status:"ok"})
    }
    catch(err){
        return res.status(400).json({message:"error"})
    }
}
module.exports = { getRecipes, getRecipe, addRecipe, updateRecipe, deleteRecipe, upload }