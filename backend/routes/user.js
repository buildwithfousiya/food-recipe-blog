const express = require("express")
const router = express.Router()
const { userSignUp, userLogin, getUser, checkUserStatus } = require("../controller/user")
const verifyToken = require("../middleware/auth")

router.post("/signUp", userSignUp)
router.post("/login", userLogin)
router.get("/user/:id", getUser)
router.get("/check-status", verifyToken, checkUserStatus)

module.exports = router
