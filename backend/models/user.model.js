import mongoose from "mongoose";
import bcrypt from "bcryptjs"

const userSchema = new mongoose.Schema({
    name:{
        type:String,
        required: [true, "Name is required"]
    },
    email:{
        type: String,
        required: [true, "Email is required"],
        unique: true,
        lowercase: true,
        trim: true
    },

    phoneNumber:{
        type: String,
        required: [true, "Phone number is required"],
    },
    password:{
        type: String,
        required: [true, "Password is required"],
        minlength: [6, "Password must be atleast 6 characters long"]
    },

    address:{
        type: String,
        required: [true, "Address is required"],

    },
    
    cartItems:[
        {
            name: {
                type: String,
                required: true
            },
            description: {
                type: String,
                required: true
            },
            images: [{
                type: String,
                required: true
            }],
            quantity:{
                type: Number,
                default: 1
            },
            product:{
                type: mongoose.Schema.Types.ObjectId,
                ref: "Product"
            },
            info:{
                price: {
                    type: Number,
                    default: 0
                },
                size: { type: String, default: "" }
            }
        }
    ],
    role:{
        type: "String",
        enum: ["customer", "admin"],
        default: "customer"
    }
}, {timestamps: true})

// Pre-save hook to has password before saving to database
userSchema.pre("save", async function (next) {
    if (!this.isModified("password")) return next()

    try{
        const salt = await bcrypt.genSalt(10)
        this.password = await bcrypt.hash(this.password, salt)
        next()
    } catch(error) {
        next(error)
    }
})

userSchema.methods.comparePassword = async function (password){
    return bcrypt.compare(password, this.password)
}

const User = mongoose.model("User", userSchema)

export default User