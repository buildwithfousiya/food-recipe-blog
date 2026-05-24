const express = require("express")
const app = express()
require("dotenv").config()
const recipeRoutes = require("./routes/recipe")
const userRoutes = require("./routes/user")
const connectDb = require("./config/connectionDb")
const cors = require("cors")

const PORT = process.env.PORT || 3000
connectDb()

app.use(express.json())
app.use(cors())
app.use(express.static("public"))

app.use("/", userRoutes)
app.use("/recipe", recipeRoutes)

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`)
})