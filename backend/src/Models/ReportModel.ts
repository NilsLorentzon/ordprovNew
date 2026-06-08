import mongoose from "mongoose";
import { z } from "zod";
import { UserValidator } from "./UserModel";

export const ReportValidator = z.object({
//   userId: z.string(),
  // limit to 100 characters
  title: z.string().max(100),
  content: z.string().min(10).max(1000),
  //   createdAt: z.string(),
});
export const ReportValidatorModel = z.object({
  userId: z.string(),
  // limit to 100 characters
  title: z.string().max(100),
  content: z.string().min(10).max(1000),
  createdAt: z.date(),
});

export type Report = z.infer<typeof ReportValidatorModel>;
const reportSchema = new mongoose.Schema<Report>({
  userId: { type: String, unique: true },
  title: String,
  content: String,
  createdAt: { type: Date, default: Date.now },
});

export const ReportModel = mongoose.model("Report", reportSchema);
