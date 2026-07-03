const express = require("express")
const app = express()
require("dotenv").config()
const recipeRoutes = require("./routes/recipe")
const userRoutes = require("./routes/user")
const adminRoutes = require("./routes/admin")
const connectDb = require("./config/connectionDb")
const cors = require("cors")

const PORT = process.env.PORT || 5000

app.use(express.json())

const allowedOrigins = [
  process.env.CLIENT_URL_LOCAL,
  process.env.CLIENT_URL_PROD,
].filter(Boolean) // remove undefined values

app.use(cors({
  origin: allowedOrigins.length > 0 ? allowedOrigins : "*",
  credentials: true
}))
app.use(express.static("public"))

app.use("/", userRoutes)
app.use("/recipe", recipeRoutes)
app.use("/admin", adminRoutes)

connectDb().catch(err => {
    console.log("database connection failed:", err.message)
})

if (process.env.NODE_ENV !== 'production' || !process.env.VERCEL) {
    app.listen(PORT, () => {
        console.log(`Server is running on port ${PORT}`)
    })
}

module.exports = app