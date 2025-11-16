const express = require("express");
const { pool } = require("../db");

const router = express.Router();

// Neuen User anlegen
router.post("/", async (req, res) => {
  const { displayName, email, password } = req.body;

  if (!displayName || !email) {
    return res
      .status(400)
      .json({ error: "displayName and email are required" });
  }

  try {
    // Für das Projekt speichern wir das Passwort zur Vereinfachung
    // direkt in password_hash. In echt müsste das gehasht werden!
    const passwordHash = password || null;

    const result = await pool.query(
      `INSERT INTO users (display_name, email, password_hash)
       VALUES ($1, $2, $3)
       RETURNING id, display_name AS "displayName",
                 email, created_at AS "createdAt"`,
      [displayName, email, passwordHash]
    );

    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error("Error creating user:", err.message);
    res.status(500).json({ error: "Failed to create user" });
  }
});

// Alle User holen
router.get("/", async (_req, res) => {
  try {
    const result = await pool.query(
      `SELECT id,
              display_name AS "displayName",
              email,
              created_at AS "createdAt"
       FROM users
       ORDER BY created_at DESC`
    );
    res.json(result.rows);
  } catch (err) {
    console.error("Error fetching users:", err.message);
    res.status(500).json({ error: "Failed to fetch users" });
  }
});

// Einen User nach ID holen
router.get("/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query(
      `SELECT id,
              display_name AS "displayName",
              email,
              created_at AS "createdAt"
       FROM users
       WHERE id = $1`,
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "User not found" });
    }

    res.json(result.rows[0]);
  } catch (err) {
    console.error("Error fetching user:", err.message);
    res.status(500).json({ error: "Failed to fetch user" });
  }
});

module.exports = router;
