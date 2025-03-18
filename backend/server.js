import express from "express"
import dotenv from "dotenv"
import cookieParser from "cookie-parser"
import path from "path"


import authRoutes from "./routes/auth.routes.js"
import productRoutes from "./routes/product.routes.js"
import cartRoutes from "./routes/cart.routes.js"
import couponRoutes from "./routes/coupon.routes.js"
import paymentRoutes from "./routes/payment.routes.js"
import analyticsRoutes from "./routes/analytics.routes.js"


import { connectDB } from "./lib/db.js"

dotenv.config()

const app = express()

app.use(express.json({ limit: "10mb"}))
app.use(cookieParser())

const PORT = process.env.PORT || 5001

const __dirname = path.resolve()

app.use("/api/auth", authRoutes)
app.use("/api/products", productRoutes)
app.use("/api/cart", cartRoutes)
app.use("/api/coupons", couponRoutes)
app.use("/api/payments", paymentRoutes)
app.use("/api/analytics", analyticsRoutes)

if (process.env.NODE_ENV === "production")
{
    app.use(express.static(path.join(__dirname, "/frontend/dist")))

    app.get("*", (req, res) => {
		res.sendFile(path.resolve(__dirname, "frontend", "dist", "index.html"));
	})
}


app.listen(PORT, () => {
    console.log("App is running on port http://localhost:" + PORT)
    connectDB()
})
