const express = require("express")
const router = express.Router()
const {
    adminLogin,
    getUsers,
    toggleBlockUser,
    deleteRecipeByAdmin
} = require("../controller/admin")
const verifyAdminToken = require("../middleware/adminAuth")

router.post("/login", adminLogin)
router.get("/users", verifyAdminToken, getUsers)
router.patch("/users/:id/block", verifyAdminToken, toggleBlockUser)
router.delete("/recipes/:id", verifyAdminToken, deleteRecipeByAdmin)

module.exports = router
