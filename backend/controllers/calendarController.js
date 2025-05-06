// controllers/calendarController.js
import puppeteer from "puppeteer";
import ical from "node-ical";

export const fetchCalendarEvents = async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res
      .status(400)
      .json({ error: "Username and password are required" });
  }

  try {
    const icalUrl = await getCalendarUrl(username, password);
    const events = await extractCalendarEvents(icalUrl);
    return res.status(200).json({ icalUrl, events });
  } catch (error) {
    console.error("❌ Error:", error);
    return res.status(500).json({ error: "Failed to fetch calendar events" });
  }
};

async function getCalendarUrl(username, password) {
  const browser = await puppeteer.launch({ headless: "new" });
  const page = await browser.newPage();

  await page.goto("https://lms.ksu.edu.sa/");
  await page.type("#user_id", username);
  await page.type("#password", password);
  await Promise.all([
    page.waitForNavigation({ timeout: 10000 }),
    page.click("#entry-login"),
  ]);

  await page.goto("https://lms.ksu.edu.sa/webapps/calendar/viewPersonal");
  await page.waitForSelector("#ical", { timeout: 10000 });
  await page.click("#ical");
  await new Promise((resolve) => setTimeout(resolve, 1000));
  await page.waitForSelector("#icalurlid", { timeout: 10000 });

  const icalUrl = await page.$eval("#icalurlid", (el) => el.textContent.trim());
  await browser.close();
  return icalUrl;
}

async function extractCalendarEvents(icalUrl) {
  const now = new Date();

  const events = await ical.async.fromURL(icalUrl);

  return Object.values(events)
    .filter((e) => e.type === "VEVENT" && e.start > now) // only future events
    .map((e) => ({
      id: e.uid,
      title: e.summary,
      description: e.description || "",
      start: e.start,
      end: e.end,
    }))
    .sort((a, b) => new Date(a.start) - new Date(b.start)); // sort by date ascending
}
