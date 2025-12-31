const express = require("express");
const { pool } = require("../db");

const router = express.Router();

const isUuid = (value) =>
  typeof value === "string" &&
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(
    value
  );

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
    console.error("Error creating user:", err);
    res.status(500).json({
      error: "Failed to create user",
      details: err.message,
      code: err.code || null,
    });
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
    console.error("Error fetching users:", err);
    res.status(500).json({
      error: "Failed to fetch users",
      details: err.message,
      code: err.code || null,
    });
  }
});

// Einen User nach ID holen
router.get("/:id", async (req, res) => {
  const { id } = req.params;

  if (!isUuid(id)) {
    return res.status(400).json({ error: "Invalid user id (must be UUID)" });
  }

  try {
    const result = await pool.query(
      `SELECT id,
              display_name AS "displayName",
              email,
              created_at AS "createdAt"
       FROM users
       WHERE id = $1::uuid`,
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "User not found" });
    }

    res.json(result.rows[0]);
  } catch (err) {
    console.error("Error fetching user:", err);
    res.status(500).json({
      error: "Failed to fetch user",
      details: err.message,
      code: err.code || null,
    });
  }
});

// User-Tag-Subscription anlegen
// POST /users/:id/subscriptions { tagId }
router.post("/:id/subscriptions", async (req, res) => {
  const { id } = req.params;
  const { tagId } = req.body;

  if (!isUuid(id)) {
    return res.status(400).json({ error: "Invalid user id (must be UUID)" });
  }
  if (!tagId || !isUuid(tagId)) {
    return res.status(400).json({ error: "Invalid or missing tagId (UUID)" });
  }

  try {
    // Prüfen, ob User existiert
    const userResult = await pool.query(
      `SELECT id FROM users WHERE id = $1::uuid`,
      [id]
    );
    if (userResult.rows.length === 0) {
      return res.status(404).json({ error: "User not found" });
    }

    // Prüfen, ob Tag existiert
    const tagResult = await pool.query(
      `SELECT id FROM tags WHERE id = $1::uuid`,
      [tagId]
    );
    if (tagResult.rows.length === 0) {
      return res.status(404).json({ error: "Tag not found" });
    }

    const result = await pool.query(
      `INSERT INTO subscriptions (user_id, tag_id)
       VALUES ($1::uuid, $2::uuid)
       ON CONFLICT (user_id, tag_id) DO NOTHING
       RETURNING user_id AS "userId", tag_id AS "tagId"`,
      [id, tagId]
    );

    if (result.rows.length === 0) {
      // Subscription existiert bereits
      return res.status(200).json({
        userId: id,
        tagId,
        info: "User is already subscribed to this tag",
      });
    }

    return res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error("Error creating subscription:", err);
    return res.status(500).json({
      error: "Failed to create subscription",
      details: err.message,
      code: err.code || null,
    });
  }
});

// Abonnierte Tags eines Users holen
// GET /users/:id/subscriptions
router.get("/:id/subscriptions", async (req, res) => {
  const { id } = req.params;

  if (!isUuid(id)) {
    return res.status(400).json({ error: "Invalid user id (must be UUID)" });
  }

  try {
    // Erst sicherstellen, dass der User existiert
    const userResult = await pool.query(
      `SELECT id FROM users WHERE id = $1::uuid`,
      [id]
    );
    if (userResult.rows.length === 0) {
      return res.status(404).json({ error: "User not found" });
    }

    const result = await pool.query(
      `SELECT t.id,
              t.name,
              t.description,
              t.created_at AS "createdAt"
       FROM subscriptions s
       JOIN tags t ON t.id = s.tag_id
       WHERE s.user_id = $1::uuid
       ORDER BY t.name ASC`,
      [id]
    );

    return res.json(result.rows);
  } catch (err) {
    console.error("Error fetching user subscriptions:", err);
    return res.status(500).json({
      error: "Failed to fetch user subscriptions",
      details: err.message,
      code: err.code || null,
    });
  }
});

router.post("/login", async (req, res) => {
  const { email, password } = req.body;
  // TODO: Hier echte Passwort-Prüfung einbauen
  // Für den Prototyp checken wir nur, ob der User existiert
  try {
    const result = await pool.query(
      `SELECT id, display_name, email FROM users WHERE email = $1`,
      [email]
    );
    if (result.rows.length === 0) {
      return res.status(401).json({ error: "Ungültige Anmeldedaten" });
    }
    // Einfacher Erfolg
    res.json({ message: "Login erfolgreich", user: result.rows[0] });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
