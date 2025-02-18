import jwt from "jsonwebtoken"
import User from "../models/user.model.js"


export const protectRoute = async (req, res, next) => {
    try {
        const accessToken = req.cookies.accessToken

        if (!accessToken) return res.status(401).json({ message: "Unauthorised - No access token provided"})
        
        try {
            const decoded = jwt.verify(accessToken, process.env.ACCESS_TOKEN_SECRET)

            const user = await User.findById(decoded.userId).select("-password")

            if (!user) return res.status(401).json({mesage: "User not found"})

            req.user = user

            next()
        } catch (error) {
            if (error.name === "TokenExpiredError") {
                return res.status(401).json({message: "Invalid - Expired error"})
            }
            throw error
        }

        
    } catch (error) {
        console.log("Error in protectRoute function")
        res.status(401).json({message: "Unauthorised - invalid access token"})
    }
}

export const adminRoute = (req, res, next) => {
    if (req.user && req.user.role === "admin"){ 
        console.log("admin check")
        next() 
    }
    else { 
        return res.status(403).json({message: "Access Denied - Admin only"}) 
    }
}