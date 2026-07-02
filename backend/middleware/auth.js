const jwt = require("jsonwebtoken")
const User = require("../models/user")

const verifyToken = async (req, res, next) => {
    let token = req.headers["authorization"]
    if (token) {
        token = token.split(" ")[1]
        jwt.verify(token, process.env.SECRET_KEY, async (err, decoded) => {
            if (err) {
                return res.status(400).json({ message: "Invalid token" })
            } else {
                try {
                    const user = await User.findById(decoded.id)
                    if (!user) {
                        return res.status(401).json({ message: "User account not found" })
                    }
                    if (user.blocked) {
                        return res.status(403).json({ message: "Your account is blocked by the admin." })
                    }
                    req.user = decoded
                    next()
                } catch (e) {
                    return res.status(500).json({ message: "Server error during authentication" })
                }
            }
        })
    }
    else {
        return res.status(400).json({ message: "No token provided" })
    }
}
module.exports = verifyToken
