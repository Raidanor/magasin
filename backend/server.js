import express from "express"
import dotenv from "dotenv"
import cookieParser from "cookie-parser"


import authRoutes from "./routes/auth.routes.js"
import productRoutes from "./routes/product.routes.js"

import { connectDB } from "./lib/db.js"

dotenv.config()

const app = express()

app.use(express.json())
app.use(cookieParser())

const PORT = process.env.PORT || 5001

app.use("/api/auth", authRoutes)
app.use("/api/products", productRoutes)



app.listen(PORT, () => {
    console.log("App is running on port http://localhost:" + PORT)

    connectDB()
})
