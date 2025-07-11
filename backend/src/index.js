  import express from "express"
  import authRoutes from "./routes/auth.route.js"
  import cors from "cors";
  import messageRoutes from "./routes/message.route.js"
  import mongoose from "mongoose";
  import cookieParser from "cookie-parser";
  import { connectdb } from "./lib/db.js";
  import { createServer } from 'http';
  import { Server } from 'socket.io';
  import Message from "./models/message.js";
  import passport from "passport";
  import session from "express-session";
  import dotenv from "dotenv"
  dotenv.config()
  const app=express()
  app.use(
  session({
    secret: "keyboard cat",
    resave: false,
    saveUninitialized: false,
  })
);
app.use(passport.initialize());
app.use(passport.session());
  const server = createServer(app);
  const io = new Server(server, {
    cors: {
      origin: process.env.frontendurl,
      methods: ["GET", "POST"],
      credentials: true
    }
  });
  app.use(cors({
    origin: process.env.frontendurl,
    credentials: true
  }));
  app.use(express.json());
  connectdb();

  async function main() {
    io.on("connection", (socket) => {
      console.log("User connected");

      socket.on("join", async ({ senderId, receiverId }) => {
        try {
          const recentMessages = await Message.find({
            $or: [
              { senderId: senderId, receiverId: receiverId },
              { senderId: receiverId, receiverId: senderId }
            ]
          }).sort({ createdAt: 1 });

          recentMessages.forEach(msg => {
            socket.emit("chat message", msg);
          });
          socket.join(senderId);
          socket.join(receiverId);
        } catch (err) {
          console.error("Error fetching chat messages:", err);
        }
      });

      socket.on("chat message", async (msg) => {
    try {
      const newMsg = new Message({
        text: msg.text,
        senderId: msg.senderId,
        receiverId: msg.receiverId,
      });

      const saved = await newMsg.save();

      io.to(msg.senderId).to(msg.receiverId).emit("chat message", saved);
    } catch (e) {
      console.error("Message send error:", e);
    }
  });


      socket.on("mark as seen", async ({ senderId, receiverId }) => {
        try {
          await Message.updateMany(
            { senderId, receiverId, seen: false },
            { $set: { seen: true } }
          );
          io.to(senderId).emit("messages seen", { by: receiverId });
        } catch (err) {
          console.error("Error marking as seen", err);
        }
      });
    });

    server.listen(5000, () => {
      console.log("Server running at http://localhost:5000");
    });
  }


  main().catch(console.error);

  app.use(cookieParser());

  app.use("/api/auth", authRoutes);

  app.use("/api/message", messageRoutes)

