import express from "express";
import protectRoute from "../middleware/protectRoute.js";
import { sendMessage, getMessage, getUserForSidebar } from "../controllers/message.controller.js";
const router = express.Router();
router.get("/conversations", protectRoute, getUserForSidebar); // order is important here as it first hits this one and then searches for the getmessages route which is right below as the path collides with the below as the /:id is taken as the path after the /conversation/ 
router.get("/:id", protectRoute, getMessage);
router.post("/send/:id", protectRoute, sendMessage);
export default router;
