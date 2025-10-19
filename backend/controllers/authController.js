import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const users = []; // Mock user storage 

// Signup controller
export const signupUser = async (req, res) => {
  const { name, email, password } = req.body;

  // Check if user already exists
  const existingUser = users.find(u => u.email === email);
  if (existingUser) {
    return res.status(409).json({ success: false, message: "User already exists" });
  }

  
  const hashedPassword = await bcrypt.hash(password, 10);

  // Create new user object
  const newUser = {
    id: users.length + 1,
    name,
    email,
    password: hashedPassword,
    balance: 10000.00,
    createdAt: new Date(),
    updatedAt: new Date()
  };

  users.push(newUser);

  
  return res.status(201).json({ success: true, message: "User registered successfully" });
};

// Login controller
export const loginUser = async (req, res) => {
  const { email, password } = req.body;

  const user = users.find(u => u.email === email);
  if (!user) {
    return res.status(401).json({ success: false, message: "Invalid email or password" });
  }

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    return res.status(401).json({ success: false, message: "Invalid email or password" });
  }

  const token = jwt.sign({ id: user.id, email: user.email }, process.env.JWT_SECRET || "secretkey", {
    expiresIn: "24h"
  });

  return res.json({
    success: true,
    message: "Login successful",
    token,
    user: { id: user.id, name: user.name, email: user.email }
  });
};
