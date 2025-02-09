import express from "express";
import { updateUserProfile } from "../controllers/userController.js";

const router = express.Router();

router.put("/update-profile", updateUserProfile);

export default router;
