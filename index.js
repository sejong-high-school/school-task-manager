const express = require("express");
const ComciganParser = require("comcigan-parser");

const app = express();
const port = process.env.PORT || 3000;

const parser = new ComciganParser();

async function getSchedule() {
  await parser.init();
  const schools = await parser.search("세종과학고등학교");
  if (!schools || schools.length === 0) {
    throw new Error("학교를 찾을 수 없습니다.");
  }

  const school = schools[0];
  await parser.setSchool(school.code);

  // 1학년 1반 시간표
  const timetable = await parser.getTimeTable(1, 1);
  return timetable;
}

app.get("/", (req, res) => {
  res.send("세종과학고 1학년 1반 시간표 API");
});

app.get("/schedule", async (req, res) => {
  try {
    const data = await getSchedule();
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
