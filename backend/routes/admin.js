const express = require("express")
const router = express.Router()
const {
    adminLogin,
    getUsers,
    toggleBlockUser,
    deleteRecipeByAdmin,
    deleteUser
} = require("../controller/admin")
const verifyAdminToken = require("../middleware/adminAuth")

router.post("/login", adminLogin)
router.get("/users", verifyAdminToken, getUsers)
router.patch("/users/:id/block", verifyAdminToken, toggleBlockUser)
router.delete("/users/:id", verifyAdminToken, deleteUser)
router.delete("/recipes/:id", verifyAdminToken, deleteRecipeByAdmin)

module.exports = router

