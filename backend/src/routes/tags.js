const express = require("express");
const { pool } = require("../db");

const router = express.Router();

// Create new tag
router.post("/", async (req, res) => {
  const { name, description } = req.body;

  if (!name) {
    return res.status(400).json({ error: "name is required" });
  }

  try {
    const result = await pool.query(
      `INSERT INTO tags (name, description)
       VALUES ($1, $2)
       RETURNING id, name, description, created_at AS "createdAt"`,
      [name, description || null]
    );

    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error("Error creating tag:", err.message);
    res.status(500).json({ error: "Failed to create tag" });
  }
});

// Get all tags
router.get("/", async (_req, res) => {
  try {
    const result = await pool.query(
      `SELECT id, name, description, created_at AS "createdAt"
       FROM tags
       ORDER BY created_at DESC`
    );

    res.json(result.rows);
  } catch (err) {
    console.error("Error fetching tags:", err.message);
    res.status(500).json({ error: "Failed to fetch tags" });
  }
});

// Get single tag
router.get("/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const result = await pool.query(
      `SELECT id, name, description, created_at AS "createdAt"
       FROM tags
       WHERE id = $1`,
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Tag not found" });
    }

    res.json(result.rows[0]);
  } catch (err) {
    console.error("Error fetching tag:", err.message);
    res.status(500).json({ error: "Failed to fetch tag" });
  }
});

module.exports = router;
