import express, { NextFunction } from "express";
import axios from "axios";
import puppeteer from "puppeteer";
import fs from "fs";
import * as cheerio from "cheerio";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import { v4 as uuid } from "uuid";
import { User, UserModel, UserTokenValidator } from "../Models/UserModel";
import { z } from "zod";
const authenticationRouter = express.Router();
const JWT_SECRET = "super_secret_vocabulary_key_123";

// interface RequestExtended extends express.Request {
//   currentUser: User;
// }

export async function injectUser(req: Request, res, next) {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];
  try {
    if (token === undefined || token === null) {
      throw new Error("No token provided.");
    }
    let decoded: any;
    decoded = jwt.verify(token, JWT_SECRET);
    const validatedUser = UserTokenValidator.safeParse(decoded);
    if (validatedUser.success) {
      const userDocument = await UserModel.findOne({
        userId: validatedUser.data.userId,
      });
      if (userDocument === null || userDocument === undefined) {
        throw new Error("User not found.");
      }
      // userDocument.lastRequest = new Date().toISOString();
      await userDocument.save();

      // console.log("Authenticated user:", userDocument.email);
      (req as any).currentUser = userDocument;
      // console.log(
      //   "Injected user into request:",
      //   (req as any).currentUser.email,
      // );
      next();
      return;
    }
  } catch (err) {
    next();
    return;
  }
  next();
}

export function authenticateToken(req, res, next) {
  // Grab token from header: "Bearer <TOKEN>"
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) {
    return res.status(401).json({ error: "Access denied. No token provided." });
  }

  try {
    // Verify the token hasn't been tampered with or expired
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded; // Attach user info (id) to the request object
    next(); // Move to the actual route handler
  } catch (error) {
    res.status(403).json({ error: "Invalid or expired token." });
  }
}

authenticationRouter.post("/signup", async (req, res) => {
  const zodValidator = z.object({
    email: z.string().email(),
    password: z.string().min(5),
    userName: z.string().min(3).max(32),
  });
  const validationResult = zodValidator.safeParse(req.body);
  if (!validationResult.success) {
    // send validation error to frontend
    return res.status(400).json({ error: validationResult.error.errors });
  }
  const { email, password, userName } = validationResult.data;
  const hashedPassword = await bcrypt.hash(password, 10);

  const newUser = new UserModel({
    userId: uuid(),
    email,
    password: hashedPassword,
    userName,
    role: "user",
  });
  await newUser.save();

  res.status(201).json({ message: "User registered successfully!" });
});

authenticationRouter.post("/login", async (req, res) => {
  const { email, password } = req.body;
  const existingUser = await UserModel.findOne({ email });
  if (existingUser === undefined || existingUser === null) {
    return res.status(400).json({ error: "Invalid email or password" });
  }
  if (!(await bcrypt.compare(password, existingUser.password))) {
    return res.status(400).json({ error: "Invalid email or password" });
  }
  // Generate a token containing the User's ID that expires in 1 hour
  const token = jwt.sign(
    {
      userId: existingUser.userId,
      role: existingUser.role,
      userName: existingUser.userName,
      email: existingUser.email,
    },
    JWT_SECRET,
    {
      expiresIn: "20h",
    },
  );
  res.json({ message: "Login successful!", token });
});

authenticationRouter.post("/test", authenticateToken, (req, res) => {
  res.json({ success: "yiipi" });
});

export default authenticationRouter;
