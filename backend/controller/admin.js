const Admin = require("../models/admin")
const User = require("../models/user")
const Recipes = require("../models/recipe")
const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")

const adminLogin = async (req, res) => {
    const { username, password } = req.body
    if (!username || !password) {
        return res.status(400).json({ message: "All fields are required" })
    }

    try {
        const admin = await Admin.findOne({ username })
        if (admin && await bcrypt.compare(password, admin.password)) {
            const token = jwt.sign(
                { username: admin.username, id: admin._id, isAdmin: true },
                process.env.SECRET_KEY
            )
            return res.status(200).json({ token, admin: { id: admin._id, username: admin.username } })
        } else {
            return res.status(400).json({ error: "Invalid admin credentials" })
        }
    } catch (error) {
        return res.status(500).json({ message: error.message })
    }
}

const getUsers = async (req, res) => {
    try {
        const users = await User.find({}, "-password")
        return res.status(200).json(users)
    } catch (error) {
        return res.status(500).json({ message: error.message })
    }
}

const toggleBlockUser = async (req, res) => {
    const { id } = req.params
    const { blocked } = req.body

    try {
        const user = await User.findById(id)
        if (!user) {
            return res.status(404).json({ message: "User not found" })
        }

        user.blocked = blocked
        await user.save()

        return res.status(200).json({ message: `User status updated to ${blocked ? "blocked" : "unblocked"}`, user })
    } catch (error) {
        return res.status(500).json({ message: error.message })
    }
}

const deleteRecipeByAdmin = async (req, res) => {
    const { id } = req.params
    try {
        const result = await Recipes.deleteOne({ _id: id })
        if (result.deletedCount === 0) {
            return res.status(404).json({ message: "Recipe not found" })
        }
        return res.status(200).json({ message: "Recipe deleted successfully by admin" })
    } catch (error) {
        return res.status(500).json({ message: error.message })
    }
}

const deleteUser = async (req, res) => {
    const { id } = req.params
    try {
        const result = await User.findByIdAndDelete(id)
        if (!result) {
            return res.status(404).json({ message: "User not found" })
        }
        return res.status(200).json({ message: "User deleted successfully" })
    } catch (error) {
        return res.status(500).json({ message: error.message })
    }
}

module.exports = {
    adminLogin,
    getUsers,
    toggleBlockUser,
    deleteRecipeByAdmin,
    deleteUser
}

