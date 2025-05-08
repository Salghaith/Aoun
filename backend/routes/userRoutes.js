import express from "express";
import { updateUserProfile } from "../controllers/userController.js";
import { fetchCalendarEvents } from "../controllers/calendarController.js";
import { fetchSchedule } from "../controllers/scheduleController.js";

const router = express.Router();

router.put("/update-profile", updateUserProfile);
router.post("/calendar-events", fetchCalendarEvents);
router.post("/fetch-schedule", fetchSchedule);

export default router;
