import express from "express";
import { updateUserProfile } from "../controllers/userController.js";
import { fetchCalendarEvents } from "../controllers/calendarController.js";
import { fetchSchedule } from "../controllers/scheduleController.js";

const router = express.Router();

router.put("/update-profile", updateUserProfile);
router.post("/calendar-events", fetchCalendarEvents);
router.post("/fetch-schedule", fetchSchedule);
router.get("/test", (req, res) => {
  res.send("Hello World");
});
router.get("/delete-account-info", (req, res) => {
  res.send(`
    <h1>Delete Your Account</h1>
    <p>You can delete your account directly inside the app under Settings → Delete My Account.</p>
    <p>Or email us at salghaith9@gmail.com and we'll process it manually within 2 days.</p>
  `);
});

export default router;
