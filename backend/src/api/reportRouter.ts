import express from "express";
import { authenticateToken } from "./authenticationRouter";
import { ReportModel, ReportSanitation } from "../Models/ReportModel";

const reportRouter = express.Router();

reportRouter.post("/", async (req, res) => {
  const currentUser = (req as any).currentUser;
  const userId = currentUser ? currentUser.userId : "anonymous";

  const validationResult = ReportSanitation.safeParse(req.body);
  if (!validationResult.success) {
    return res.status(400).json({ error: "Invalid request parameters" });
  }
  const { title, content } = validationResult.data;
  const newReport = new ReportModel({
    userId,
    title,
    content,
  });
  await newReport.save();
  return res.status(201).json({ message: "Report submitted successfully" });
});

export default reportRouter;
