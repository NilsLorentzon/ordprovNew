import mongoose from "mongoose";
import { z } from "zod";

const UserValidator = z.object({
  userId: z.string(),
  userName: z.string(),
  email: z.string().email(),
  role: z.enum(["admin", "user", "moderator"]),
  password: z.string(),
  isVerified: z.boolean(),
  verificationToken: z.string(),
  createdAt: z.coerce.date(),
  lastRequest: z.coerce.date(),
});
export const UserTokenValidator = z.object({
  userId: z.string(),
  userName: z.string(),
  email: z.string().email(),
  role: z.enum(["admin", "user", "moderator"]),
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
  createdAt: { type: Date, default: Date.now },
  lastRequest: { type: Date, default: Date.now },
});

export const UserModel = mongoose.model("User", userSchema);
