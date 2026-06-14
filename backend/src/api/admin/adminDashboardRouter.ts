import express from "express";
import { isValid } from "zod";
import { UserModel } from "../../Models/UserModel";

const adminDashboardRouter = express.Router();

adminDashboardRouter.get("/", async (req, res) => {
  const verifiedUsers = await UserModel.find(
    {
      isVerified: true,
    },
    {
      userId: 1,
      email: 1,
      userName: 1,
      lastRequest: 1,
    },
  ).sort({ lastRequest: -1 });

  const adminData = {
    verifiedUsers: verifiedUsers,
    amountOfVerifiedUsers: verifiedUsers.length,
  };
  res.json(adminData);
});

export default adminDashboardRouter;
