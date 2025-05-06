import express from "express";
import { updateUserProfile } from "../controllers/userController.js";
import { fetchCalendarEvents } from "../controllers/calendarController.js";

const router = express.Router();

router.put("/update-profile", updateUserProfile);
router.post("/calendar-events", fetchCalendarEvents);

export default router;
