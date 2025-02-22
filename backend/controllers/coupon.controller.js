import Coupon from "../models/coupon.model.js"

export const getCoupon = async (req,res) => {
    try {
        const coupon = await Coupon.findOne({ userId: req.user.Id, isActive: true})
        res.json(coupon || null)

    } catch (error) {
        console.log("Error in getCoupon function")
        res.status(401).json({ error: error.message})
    }
}

export const validateCoupon = async (req,res) => {
    try {
        const { code } = req.body
        const coupon = await Coupon.findOne({ code:code, userId: req.user._id, isActive: true})

        if (!coupon) return res.status(404).json({ message: "Coupon not found"})

        if (coupon.expirationDate < new Date()){
            coupon.isActive = false
            await coupon.save()
            return res.status(404).json({ message: "Coupon Expired"})
        }

        res.json({
            message: "Coupon is valid",
            code: coupon.code,
            discoutPercentage: coupon.discountPercentage
        })
    } catch (error) {
        console.log("Error in valiadateCoupon function")
        res.status(401).json({ error: error.message})
    }
}