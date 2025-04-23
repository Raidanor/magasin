import { redis } from "../lib/redis.js"
import User from "../models/user.model.js"
import jwt from "jsonwebtoken"

const generateToken = (userId) => {
    const accessToken = jwt.sign({ userId }, process.env.ACCESS_TOKEN_SECRET, {
        expiresIn: "30m"
    })
    const refreshToken = jwt.sign({ userId }, process.env.REFRESH_TOKEN_SECRET, {
        expiresIn: "7d"
    })

    return { accessToken, refreshToken}
}

const storeRefreshToken = async(userId, refreshToken) => {
    await redis.set(`refresh_token:${userId}`, refreshToken, "EX", 7 * 24 * 60 * 60)
}

const setCookies = (res, accessToken, refreshToken) => {
    res.cookie("accessToken", accessToken, {
        httpOnly: true,  //prevent XSS attacks
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        maxAge: 30 * 60 * 1000
    })
    res.cookie("refreshToken", refreshToken, {
        httpOnly: true,  //prevent XSS attacks
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        maxAge: 7 * 24 * 60 * 60 * 1000
    })

}


export const signup = async (req, res) => {
    const {email, password, name, phoneNumber, address} = req.body

    try{
        const userExists = await User.findOne({ email })
    
        if (userExists) return res.status(400).json({message: "User already exists"})
    
        const user = await User.create({name, email, phoneNumber, password, address})

        const {accessToken, refreshToken} = generateToken(user._id)
        await storeRefreshToken(user._id, refreshToken)

        setCookies(res, accessToken, refreshToken)


        res.status(201).json({
            _id: user._id,
            name: user.name,
            email: user.email,
            phoneNumber: user.phoneNumber,
            address: user.address,
            role: user.role
        })

    } catch(error) {
        return res.status(500).json({message: error.message})
    }    
}

export const updateProfile = async (req, res) => {
    const { name, email, phoneNumber, address } = req.body
    const userId = req.user._id

    try{
        let user = await User.findById(userId)

        user.name = name || user.name
        user.email = email || user.email
        user.address = address || user.address
        user.phoneNumber = phoneNumber || user.phoneNumber
    
        await user.save()

        return res.status(200).json(user)

    } catch(error) {
        return res.status(500).json({message: error.message})
    }    
}

export const login = async (req, res) =>
{
    try {
        
        const {email, password} = req.body
        const user = await User.findOne({email})

        if (user && (await user.comparePassword(password))){
            
            const {accessToken, refreshToken} = generateToken(user._id)

            await storeRefreshToken(user._id, refreshToken)
            setCookies(res, accessToken, refreshToken)

            res.json({
                _id: user._id,
                name: user.name,
                email: user.email,
                address: user.address,
                phoneNumber: user.phoneNumber,
                role: user.role
            })
        } else {
            return res.status(400).json({message:"Invalid email or password"})
        }

    } catch (error) {
        console.log("error in login controller", error.message)
        res.status(500).json({ message: "Server error: ", error: error.message})
    }
}

export const logout = async (req, res) =>
{
    try {
        const refreshToken = req.cookies.refreshToken
        if (refreshToken){
            const decoded = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET)
            await redis.del(`refresh_token:${decoded.userId}`)
        }

        res.clearCookie("accessToken")
        res.clearCookie("refreshToken")
        res.json({ message: "Logged out successfully"})
        
    } catch (error) {
        console.log("error in logout controller", error.message)
        res.status(500).json({ message: "Server error: ", error: error.message})
        
    }
}

export const refreshToken = async(req, res) => {
    try {
        const refreshToken = req.cookies.refreshToken

        if (!refreshToken) { 
            return res.status(401).json({ message: "No refresh token provided"})
        }

        const decoded = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET)

        const storedToken = await redis.get(`refresh_token:${decoded.userId}`)

        if (storedToken !== refreshToken){
            return res.status(401).json({message: "Invalid refresh token"})
        }

        const accessToken = jwt.sign({ userId: decoded.userId }, process.env.ACCESS_TOKEN_SECRET, {
            expiresIn: "15m"
        })

        res.cookie("accessToken", accessToken, {
            httpOnly: true,  //prevent XSS attacks
            secure: process.env.NODE_ENV === "production",
            sameSite: "strict",
            maxAge: 15 * 60 * 1000
        })

        res.json({message: "Token refreshed successfully"})
    } catch (error) {
        console.log("Error in refreshToken controller")
        res.status(401).json({ message: "Server error", error: error.message })
    }
}

export const getProfile = async(req, res) => {
    try {
        res.json(req.user)
    } catch (error) {
        console.log("Error in getProfile controller")
        res.status(401).json({ message: "Server error", error: error.message })
    }
}

export const getAllUsers = async(req, res) => {
    try {
        const allUsers = await User.find({}).select("-password")
        res.json(allUsers)
    } catch (error) {
        console.log("Error in getAllProfiles controller")
        res.status(401).json({ message: "Server error", error: error.message })
    }
}