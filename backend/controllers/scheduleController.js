// controllers/scheduleController.js
import puppeteer from "puppeteer";

export const fetchSchedule = async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res
        .status(400)
        .json({ error: "Username and password are required." });
    }

    const browser = await puppeteer.launch({
      args: ["--no-sandbox", "--disable-setuid-sandbox"],
    });

    const page = await browser.newPage();

    await page.goto("https://edugate.ksu.edu.sa/ksu/init");
    await Promise.all([
      page.waitForNavigation({ waitUntil: "networkidle0", timeout: 10000 }),
      page.evaluate(() => {
        const el = document.querySelector(
          "#loginForm > div.topBarKSU.loginTop > div.topBarLinkSec > div > a:nth-child(3)"
        );
        if (el) el.click();
      }),
    ]);

    await page.type("#username", username);
    await page.type("#password", password);
    await Promise.all([
      page.waitForNavigation({ timeout: 10000 }),
      page.click("#loginButton"),
    ]);

    await page.goto(
      "https://edugate.ksu.edu.sa/ksu/ui/student/student_schedule/index/forwardStudentSchedule.faces"
    );
    await page.waitForSelector("#myForm", { timeout: 10000 });

    const dayMap = {
      1: "Sunday",
      2: "Monday",
      3: "Tuesday",
      4: "Wednesday",
      5: "Thursday",
    };

    const parseTime = (raw) => raw.split(" - ").map((t) => t.trim());

    const schedule = [];

    let x = 1;
    while (true) {
      const nameSelector = `#myForm :nth-child(1) > tbody > tr:nth-child(${x}) > td:nth-child(2) > table > tbody > tr:nth-child(2) > td > span`;
      const codeSelector = `#myForm :nth-child(1) > tbody > tr:nth-child(${x}) > td:nth-child(1) > center > table > tbody > tr > td`;
      const sectionSelector = `#myForm :nth-child(1) > tbody > tr:nth-child(${x}) > td:nth-child(5) > center`;
      const daysSelector = `#myForm :nth-child(1) > tbody > tr:nth-child(${x}) > td:nth-child(7) tr td:nth-child(1) tr:nth-child(2)`;
      const hoursSelector = `#myForm :nth-child(1) > tbody > tr:nth-child(${x}) > td:nth-child(7) tr td:nth-child(2) tr:nth-child(2)`;

      try {
        const name = await page.$eval(nameSelector, (el) =>
          el.innerText.trim()
        );
        const code = await page.$eval(codeSelector, (el) =>
          el.innerText.trim()
        );
        const sectionNum = await page.$eval(sectionSelector, (el) =>
          el.innerHTML.trim()
        );
        const daysRaw = await page.$eval(daysSelector, (el) =>
          el.innerText.trim()
        );
        const hoursRaw = await page.$eval(hoursSelector, (el) =>
          el.innerText.trim()
        );

        const days = daysRaw.split(" ").map((n) => dayMap[Number(n)]);
        const [startTime, endTime] = parseTime(hoursRaw);

        const lectures = days.map((day) => ({
          day,
          startTime,
          endTime,
        }));

        const existing = schedule.find(
          (s) => s.subjectCode === code && s.subjectName === name
        );

        if (existing) {
          existing.lectures.push(...lectures);
        } else {
          schedule.push({
            sectionNum,
            subjectCode: code,
            subjectName: name,
            lectures,
          });
        }

        x++;
      } catch {
        break;
      }
    }

    await browser.close();
    return res.status(200).json(schedule);
  } catch (err) {
    console.error("❌ Scraper error:", err);
    return res.status(500).json({ error: `Failed to fetch schedule ${err}` });
  }
};
