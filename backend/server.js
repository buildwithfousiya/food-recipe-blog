const express = require("express")
const app = express()
require("dotenv").config()
const recipeRoutes = require("./routes/recipe")
const userRoutes = require("./routes/user")
const connectDb = require("./config/connectionDb")
const cors = require("cors")

const PORT = process.env.PORT || 5000

app.use(express.json())
app.use(cors())
app.use(express.static("public"))

app.use("/", userRoutes)
app.use("/recipe", recipeRoutes)

connectDb().catch(err => {
    console.log("database connection failed:", err.message)
})

if (process.env.NODE_ENV !== 'production' || !process.env.VERCEL) {
    app.listen(PORT, () => {
        console.log(`Server is running on port ${PORT}`)
    })
}

module.exports = app