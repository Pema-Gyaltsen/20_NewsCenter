require("dotenv").config();
const express = require("express");
const cors = require("cors");
const { pool } = require("./db");

const app = express();
const port = process.env.PORT || 3000;

let clients = [];

const broadcaster = (data) => {
  clients.forEach((client) => {
    if (client.tag && data.tags && !data.tags.includes(client.tag)) {
        return;
    }
    
    client.res.write(`data: ${JSON.stringify(data)}\n\n`);
  });
};


const usersRouter = require("./routes/users");
const tagsRouter = require("./routes/tags");
const messagesRouter = require("./routes/messages")(broadcaster);

app.use(cors());
app.use(express.json());
app.use("/users", usersRouter);
app.use("/tags", tagsRouter);
app.use("/messages", messagesRouter);

app.get("/subscribe", (req, res) => {
  const { tag } = req.query; 

  res.writeHead(200, {
    "Content-Type": "text/event-stream",
    "Connection": "keep-alive",
    "Cache-Control": "no-cache",
    "Access-Control-Allow-Origin": "*",
  });

  const clientId = Date.now();
  const newClient = {
    id: clientId,
    res,
    tag,
  };
  clients.push(newClient);

  const initialData = { 
    message: `Connected to NewsCenter Live Feed. ${tag ? 'Filtering by tag: ' + tag : 'No tag filter applied.'}`, 
    clientId 
  };
  res.write(`data: ${JSON.stringify(initialData)}\n\n`);

  req.on("close", () => {
    console.log(`[SSE] ${clientId} Connection closed.`);
    clients = clients.filter((client) => client.id !== clientId);
  });
});

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