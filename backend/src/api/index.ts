import express from "express";

import testRouter from "./scripts/testRouter";
import authenticationRouter, {
  authenticateAdminToken,
  authenticateToken,
} from "./authenticationRouter";
import repetitionRouter from "./scripts/repetitionRouter";
import answerRouter from "./answerRouter";
import saldoRouter from "./scripts/saldoRouter";
import statisticsRouter from "./statisticsRouter";
import wordRouter from "./wordRouter";
import reportRouter from "./reportRouter";
import adminDashboardRouter from "./admin/adminDashboardRouter";
// import emailRouter from "./emailRouter";

const apiRouter = express.Router();

// apiRouter.use("/test", testRouter);
// apiRouter.use("/wiki", wikiRouter);
// apiRouter.use("/repetition", repetitionRouter);
// apiRouter.use("/saldo", saldoRouter);
// apiRouter.use("/email", emailRouter);
// apiRouter.use("/scripts", scriptsRouter);

apiRouter.use("/authentication", authenticationRouter);
apiRouter.use("/statistics", authenticateToken, statisticsRouter);
apiRouter.use("/answer", answerRouter);
apiRouter.use("/word", wordRouter);
apiRouter.use("/report", reportRouter);

apiRouter.use("/admin-dashboard", authenticateAdminToken, adminDashboardRouter);
export default apiRouter;
