import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { pool } from "./db.js";

export async function register(req, res) {
  try {
    const { email, password } = req.body;
    console.log("REQ BODY:", req.body);

    const hash = await bcrypt.hash(password, 10);
    console.log("HASH:", hash);

    const result = await pool.query(
      "INSERT INTO users (email, password_hash) VALUES ($1, $2) RETURNING id",
      [email, hash]
    );

    console.log("DB RESULT:", result.rows);
    res.json({ message: "registered successfully" });
  } catch (err) {
    console.error("REGISTER ERROR 👉", err.message);
    res.status(500).json({ error: err.message });
  }
}

export async function login(req, res) {
  const { email, password } = req.body;

  const user = await pool.query(
    "SELECT * FROM public.users WHERE email = $1",
    [email]
  );

  if (!user.rows.length) return res.sendStatus(401);

  const valid = await bcrypt.compare(
    password,
    user.rows[0].password_hash
  );

  if (!valid) return res.sendStatus(401);

  const token = jwt.sign(
    { id: user.rows[0].id },
    process.env.JWT_SECRET
  );

  res.json({ token });
}