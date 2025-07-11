import User from "../models/user.js"
import jwt from "jsonwebtoken"
import bcrypt from "bcryptjs"
import cloudinary from "../lib/cloudinary.js";
export const signup = async (req, res) => {
  console.log("signup hits")
  const { name, email, password } = req.body;
  console.log("Signup req body:", req.body);

  try {
    if (!name || !email || !password) {
      return res.status(400).json({ message: "All fields must be filled" });
    }

    const emailToCheck = email.toLowerCase();
    console.log("Checking for existing user:", emailToCheck);
    const existingUser = await User.findOne({ email: emailToCheck });
    console.log("Existing user found:", existingUser);

    if (existingUser) {
      console.log("user already exists");
      return res.status(400).json({ message: "Email already exists" });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newuser = new User({
      name,
      email: emailToCheck,
      password: hashedPassword,
    });

    await newuser.save();

    const token = jwt.sign({ id: newuser._id }, "my-secret", {
      expiresIn: "7d",
    });

    res.cookie("jwt", token, {
      maxAge: 24 * 60 * 60 * 1000,
      httpOnly: true,
      sameSite: "strict",
      secure: false,
    });

    return res.status(201).json({
      _id: newuser._id,
      name: newuser.name,
      email: newuser.email,
      profilepic: newuser.profilepic,
    });
  } catch (err) {
    console.error("Signup error:", err);
    return res.status(500).json({ message: "Server error" });
  }
};


export const login =async (req,res)=>{
    const {email, password}=req.body;
    try{
        const user=await User.findOne({email});
        if(!user){
            return res.status(400).json({ message: "invalid email" });
        }
        const verified=await bcrypt.compareSync(password, user.password);
        
        if(!verified){
            return res.status(400).json({ message: "wrong password" });
        }
        const token = jwt.sign({ id: user._id }, "my-secret", {
        expiresIn: "7d",
        });

        res.cookie("jwt", token, {
        maxAge: 24 * 60 * 60 * 1000,
        httpOnly: true,
        sameSite: "None",
        secure: true,
        });

        return res.status(201).json({
        _id: user._id,
        name: user.name,
        email: user.email,
        profilepic: user.profilepic,
        });
    }catch(error){
        console.log(error)
         return res.status(400).json({ message: "Internal server error" });
    }
}

export const logout =(req,res)=>{
    try {
        res.cookie("jwt","",{maxAge:0})
        return res.status(200).json({message:"logged out succesfully"})
    } catch (error) {
        console.log(error)
        return res.status(500).json({ message: "Internal server error" });
    }
}

export const updateprofile=async (req,res)=>{
  try{
    const {profilepic}=req.body
    const userId=req.user._id
    if(!profilepic){
      return res.status(400).json({message:"invalid image for profile pic"})
    }
    const response=await cloudinary.uploader.upload(profilepic)
    const updateuser= await User.findByIdAndUpdate(userId,{profilepic: response.secure_url},{new:true})
    return res.status(200).json(updateuser)
  }catch(error){
        console.log(error)
        return res.status(500).json({ message: "update profile server error" });
  }
}

export const checkauth=(req,res)=>{
  try{
    if (!req.user) {
      return res.status(401).json({ message: "Unauthorized - User not verified" });
    }
    res.status(200).json(req.user);
    console.log(req.user)
  }catch(error){
        console.log(error)
        return res.status(500).json({ message: "user unverified" });
  }
}
