require("dotenv").config();
const express = require("express");
const cors = require("cors");
const { pool } = require("./db");
const usersRouter = require("./routes/users");
const tagsRouter = require("./routes/tags");
const messagesRouter = require("./routes/messages");

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use("/users", usersRouter);
app.use("/tags", tagsRouter);
app.use("/messages", messagesRouter);

app.get("/", (req, res) => {
  res.json({ message: "NewsCenter backend is running" });
});

app.get("/db-check", async (req, res) => {
  try {
    const result = await pool.query("SELECT NOW() AS now");
    res.json({ status: "ok", time: result.rows[0].now });
  } catch (err) {
    console.error("DB error:", err.message);
    res.status(500).json({ status: "error", error: err.message });
  }
});

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
