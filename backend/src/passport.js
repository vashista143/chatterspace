import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import User from "./models/user.js";
import dotenv from "dotenv"
dotenv.config()
import cloudinary from "./lib/cloudinary.js";

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.clientID,
      clientSecret: process.env.clientSecret,
      callbackURL: "http://localhost:5000/api/auth/google/callback",
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        const email = profile.emails[0].value;
        let user = await User.findOne({ email });

        if (!user) {
          const imageResponse = await fetch(profile.photos[0].value);
          const imageBuffer = await imageResponse.arrayBuffer();
          const base64Image = `data:image/jpeg;base64,${Buffer.from(imageBuffer).toString("base64")}`;
          const cloudUpload = await cloudinary.uploader.upload(base64Image);
          user = await User.create({
            name: profile.displayName,
            email,
            profilepic: cloudUpload.secure_url,
          });
        }

        done(null, user);
      } catch (err) {
        console.error("Google Strategy Error:", err);
        done(err, null);
      }
    }
  )
);

passport.serializeUser((user, done) => {
  done(null, user._id);
});

passport.deserializeUser(async (_id, done) => {
  const user = await User.findById(_id);
  done(null, user);
});
