import mongoose from "mongoose";
import { z } from "zod";

export const UserValidator = z.object({
  userName: z.string(),
  email: z.string().email(),
  role: z.enum(["admin", "user", "moderator"]),
  userId: z.string(),
  password: z.string(),
  isVerified: z.boolean(),
  verificationToken: z.string(),
  // lastRequest: z.string(),
});
export const UserTokenValidator = z.object({
  userName: z.string(),
  email: z.string().email(),
  role: z.enum(["admin", "user", "moderator"]),
  userId: z.string(),
  // lastRequest: z.string(),
});
export type User = z.infer<typeof UserValidator>;
const userSchema = new mongoose.Schema<User>({
  userId: { type: String, unique: true },
  userName: String,
  email: { type: String, unique: true, lowercase: true, trim: true },
  role: String,
  password: String,
  isVerified: Boolean,
  verificationToken: String,
  // lastRequest: String,
});

export const UserModel = mongoose.model("User", userSchema);
