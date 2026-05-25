const User = require("../models/User")
const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")

const register = async (req, res) => {
    try{
        const{fullname, email,password,yearOfStudy} = req.body
const existingUser = await User.findOne({email})
if(existingUser){
    return res.status(400).json({message : "User already exists"})
}

const hashedPassword = await bcrypt.hash(password,10)

const newUser = new User ({
    fullname,
    email,
    password : hashedPassword,
    yearOfStudy
})
await newUser.save()

res.status(201).json({message:"User Registered successfully"})
    }
    catch(error){
        res.status(500).json({message : "Server Error"})
    }
}

const login = async(req,res)=>{
    try{
        const {email,password} = req.body
        const user = await User.findOne({email})
        if(!user){
            return res.status(404).json({message : "User Not found"})
        }

        const isMatch = await bcrypt.compare(password, user.password)
        if (!isMatch){
            return res.status(400).json({message :"Invalid Credentials"})
        }

        const token = jwt.sign(
            {id : user._id},
            process.env.JWT_SECRET,
            {expiresIn : "7d"}
        )
        res.status(200).json({token})

    }catch(error){
        res.status(500).json({message: "Server Error"})
    }
}
module.exports = {register,login}