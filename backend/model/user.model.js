import mongoose from "mongoose";
import bcrypt from 'bcryptjs'

const userSchema = new mongoose.Schema({
    name : String,  
    email : String,
    password : String,
    isVerified : {
        type : Boolean,
        default : false
    },
    verificationToken : {
        type : String
    },
    resetPasswordToken : {
        type : String
    },
    resetPasswordExpires : {
        type : Date
    }
},{
    timestamps : true
})


userSchema.pre('save', async function(next) {
    if(this.isModified('password')){
        this.password = await bcrypt.hash(this.password, 10)
    }
})

const User = mongoose.model('user', userSchema)
export default User