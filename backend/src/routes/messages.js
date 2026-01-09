const express = require("express");
const { pool } = require("../db");
const auth = require("../middleware/auth");

module.exports = (broadcaster) => {
  const router = express.Router();

  // Create message (requires auth)
  router.post("/", auth, async (req, res) => {
    // depending on your auth middleware, it might be:
    // req.user.id  OR  req.user.userId
    const authorId = req.user?.id || req.user?.userId;

    const { title, body } = req.body;

    if (!authorId) {
      return res.status(401).json({ error: "UNAUTHORIZED" });
    }
    if (!title || !body) {
      return res.status(400).json({ error: "TITLE_AND_BODY_REQUIRED" });
    }

    try {
      const result = await pool.query(
        `INSERT INTO messages (author_id, title, body)
         VALUES ($1::uuid, $2, $3)
         RETURNING id,
                   author_id AS "authorId",
                   title,
                   body,
                   created_at AS "createdAt"`,
        [authorId, title, body]
      );

      const newMessage = result.rows[0];

      // notify websocket / sse / whatever broadcaster is
      if (typeof broadcaster === "function") {
        broadcaster(newMessage);
      }

      return res.status(201).json(newMessage);
    } catch (err) {
      console.error("Error creating message:", err);
      return res.status(500).json({
        error: "Failed to create message",
        details: err.message,
        code: err.code || null,
      });
    }
  });

  // Tag a message (usually should also require auth)
  router.post("/:id/tags", auth, async (req, res) => {
    const { id } = req.params;
    const { tagId } = req.body;

    if (!tagId) {
      return res.status(400).json({ error: "tagId is required" });
    }

    try {
      const result = await pool.query(
        `INSERT INTO message_tags (message_id, tag_id)
         VALUES ($1::uuid, $2::uuid)
         RETURNING message_id AS "messageId",
                   tag_id     AS "tagId"`,
        [id, tagId]
      );

      return res.status(201).json(result.rows[0]);
    } catch (err) {
      console.error("Error tagging message:", err);
      return res.status(500).json({
        error: "Failed to tag message",
        details: err.message,
        code: err.code || null,
      });
    }
  });

  // List messages (public)
  router.get("/", async (_req, res) => {
    try {
      const result = await pool.query(
        `SELECT id,
                author_id AS "authorId",
                title,
                body,
                created_at AS "createdAt"
         FROM messages
         ORDER BY created_at DESC`
      );

      return res.json(result.rows);
    } catch (err) {
      console.error("Error fetching messages:", err);
      return res.status(500).json({
        error: "Failed to fetch messages",
        details: err.message,
        code: err.code || null,
      });
    }
  });

  // Get one message (public)
  router.get("/:id", async (req, res) => {
    const { id } = req.params;

    try {
      const result = await pool.query(
        `SELECT id,
                author_id AS "authorId",
                title,
                body,
                created_at AS "createdAt"
         FROM messages
         WHERE id = $1::uuid`,
        [id]
      );

      if (result.rows.length === 0) {
        return res.status(404).json({ error: "Message not found" });
      }

      return res.json(result.rows[0]);
    } catch (err) {
      console.error("Error fetching message:", err);
      return res.status(500).json({
        error: "Failed to fetch message",
        details: err.message,
        code: err.code || null,
      });
    }
  });

  return router;
};
