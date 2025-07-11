import express from "express"
import jwt from "jsonwebtoken";
import { checkauth, login, logout, signup, updateprofile } from "../controllers/auth.controller.js"
import { protectroute } from "../middlewares/auth.middleware.js"
import nodemailer from "nodemailer";
import User from "../models/user.js";
import passport from "passport";
import "../passport.js";
import dotenv from "dotenv"
dotenv.config()
const router= express.Router()

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.mail,
    pass: process.env.mailpasskey,
  },
});

router.get("/google", passport.authenticate("google", { scope: ["profile", "email"] }));

router.get(
  "/google/callback",
  passport.authenticate("google", {
    failureRedirect: "/login",
    session: false,
  }),
  (req, res) => {
    const token = jwt.sign({ id: req.user._id }, "my-secret", {
      expiresIn: "7d",
    });

    res.cookie("jwt", token, {
      maxAge: 24 * 60 * 60 * 1000,
      httpOnly: true,
      sameSite: "strict",
      secure: false,
    });

    res.redirect(process.env.frontendurl);
  }
);

router.post("/signup", signup)

router.post("/login", login)

router.post("/logout", logout)

router.put("/update-profile", protectroute, updateprofile)

router.post("/send-otp", async (req, res) => {
  const { email, otp } = req.body;

  try {
    const emailToCheck = email.toLowerCase();
    const existingUser = await User.findOne({ email: emailToCheck });
    if (existingUser) {
      return res.status(400).json({ message: "User with this email already exists" });
    }

    await transporter.sendMail({
      from: process.env.mail,
      to: emailToCheck,
      subject: "Your OTP Code",
      text: `Your OTP is ${otp}`,
    });

    res.status(200).json({ message: "OTP sent" });
  } catch (error) {
    console.error("Email send error:", error);
    res.status(500).json({ message: "Failed to send OTP" });
  }
});



router.get("/check", protectroute, checkauth)
export default router;