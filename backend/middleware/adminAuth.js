const jwt = require("jsonwebtoken")
const Admin = require("../models/admin")

const verifyAdminToken = async (req, res, next) => {
    let token = req.headers["authorization"]
    if (token) {
        token = token.split(" ")[1]
        jwt.verify(token, process.env.SECRET_KEY, async (err, decoded) => {
            if (err) {
                return res.status(401).json({ message: "Invalid admin token" })
            } else {
                if (!decoded.isAdmin) {
                    return res.status(403).json({ message: "Access denied. Not an admin." })
                }
                
                try {
                    const admin = await Admin.findById(decoded.id)
                    if (!admin) {
                        return res.status(403).json({ message: "Access denied. Admin account not found." })
                    }
                    req.admin = decoded
                    next()
                } catch (e) {
                    return res.status(500).json({ message: "Internal server error" })
                }
            }
        })
    } else {
        return res.status(401).json({ message: "No admin token provided" })
    }
}

module.exports = verifyAdminToken
