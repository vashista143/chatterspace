import express from "express"
import { protectroute } from "../middlewares/auth.middleware.js"
import { getmessages, getusersforsidebar, sendmessage } from "../controllers/message.controller.js";
const router = express.Router()

router.get("/users", protectroute, getusersforsidebar)

router.get("/:id", protectroute, getmessages)

router.post("/send/:id", protectroute, sendmessage)
export default router;