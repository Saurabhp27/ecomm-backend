import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

let users = []; // temporary DB

const SECRET = "mysecret";

export const register = async ({ email, password }) => {
  const existingUser = users.find(u => u.email === email);
  if (existingUser) {
    throw new Error("User already exists");
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const user = {
    id: Date.now(),
    email,
    password: hashedPassword
  };

  users.push(user);

  return { message: "User registered successfully" };
};

export const login = async ({ email, password }) => {
  const user = users.find(u => u.email === email);

  if (!user) {
    throw new Error("User not found");
  }

  const isMatch = await bcrypt.compare(password, user.password);

  if (!isMatch) {
    throw new Error("Invalid password");
  }

  const token = jwt.sign(
    { id: user.id, email: user.email },
    SECRET,
    { expiresIn: "1h" }
  );

  return { token };
};