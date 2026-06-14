import mongoose from "mongoose";
import { z } from "zod";

const ReportValidatorModel = z.object({
  userId: z.string(),
  title: z.string().max(100),
  content: z.string().min(10).max(1000),
  createdAt: z.date(),
});
export const ReportSanitation = z.object({
  title: z.string().max(100),
  content: z.string().min(10).max(1000),
});

export type Report = z.infer<typeof ReportValidatorModel>;
const reportSchema = new mongoose.Schema<Report>({
  userId: { type: String, unique: true },
  title: String,
  content: String,
  createdAt: { type: Date, default: Date.now },
});

export const ReportModel = mongoose.model("Report", reportSchema);
