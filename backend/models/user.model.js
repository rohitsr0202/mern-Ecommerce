import mongoose from "mongoose";  
import bcrypt from "bcryptjs"

const userSchema = new mongoose.Schema({
    name:{
        type: String,
        required: [true,"Name is required"]
    },
    email:{
        type: String,
        required: [true,"Email is required"],
        unique: true,
        lowercase: true,
        trim: true,
    },
    password: {
        type: String,
        required: [true, "Password id required"],
        minlength: [6, "Password must be at least 6 character long"]
    },
    cartItems:[
        {
            quantity:{
                type: Number,
                default: 1
            },
            product:{
                type: mongoose.Schema.Types.ObjectId,
                ref: "Product"
            }
        }
    ],
    role:{
        type: String,
        enum:["customer", "admin"],
        default: "customer"
    }
    
},{
    timestamps: true //Timestamps in Mongoose automatically add createdAt and updatedAt fields to your schema, which store the document's creation time and last modification time, respectively
})


// per-save hook to hash the password before saving to database
userSchema.pre("save", async function (next) {
    if(!this.isModified("password")) return next();
    try {
        const salt = await bcrypt.genSalt(10);//In bcrypt, a salt is a random string that's added to a password before hashing to make the resulting hash unpredictable
        this.password = await bcrypt.hash(this.password,salt);
        next()
    } catch (error) {
        next(error)
    }
})


// to compare password to the password in database
userSchema.methods.comparepassword = async function (password) {
    return bcrypt.compare(password, this.password);
}

const User = mongoose.model("User", userSchema);

export default User;