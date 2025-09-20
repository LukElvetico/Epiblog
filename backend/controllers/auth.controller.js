// backend/controllers/auth.controller.js

import User from "../models/User.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

export const register = async (req, res) => {
  try {
    const { firstName, email, password } = req.body;
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json({ message: "L'email è già in uso" });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({
      username: firstName, // O firstName, a seconda del tuo modello
      email,
      password: hashedPassword,
    });
    await newUser.save();
    res.status(201).json({ message: "Utente registrato con successo!" });
  } catch (error) {
    res.status(500).json({ message: "Errore durante la registrazione", error });
  }
};

export const login = async (req, res) => {
  // Logica di login
}; 