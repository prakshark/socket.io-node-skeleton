import express from "express";
import {getAllChats, addChat} from "../controllers/chat.controller.js";
import { protectRoute } from "../middlewares/protectRoute.js";

const router = express.Router();

router.get("/chats", protectRoute, getAllChats);
router.post("/chats", protectRoute, addChat);

export default router;