import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import fs from "fs";
import path from "path";

import pool from "../config/db.js";

const privateKeyPath = path.resolve("src/certs/private.pem");
const PRIVATE_KEY = fs.readFileSync(privateKeyPath, "utf8");

export const register = async ({ email, password }) => {
  const existingUser = await pool.query(
    "SELECT * FROM users WHERE email = $1",
    [email]
  );

  if (existingUser.rows.length > 0) {
    throw new Error("User already exists");
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  await pool.query(
    "INSERT INTO users (email, password) VALUES ($1, $2)",
    [email, hashedPassword]
  );

  return { message: "User registered successfully" };
};

export const login = async ({ email, password }) => {
    const result = await pool.query(
    "SELECT * FROM users WHERE email = $1",
    [email]
  );

  const user = result.rows[0];

  if (!user) {
    throw new Error("User not found");
  }

  const isMatch = await bcrypt.compare(password, user.password);

  if (!isMatch) {
    throw new Error("Invalid password");
  }

  const token = jwt.sign(
    { id: user.id, email: user.email },
    PRIVATE_KEY,
    { algorithm: "RS256", expiresIn: "1h" }
  );

  return { token };
};