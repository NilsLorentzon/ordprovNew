import express from "express";

import testRouter from "./scripts/testRouter";
import authenticationRouter, {
  authenticateAdminToken,
  authenticateToken,
  bearerAuthentication,
} from "./authenticationRouter";
import repetitionRouter from "./scripts/repetitionRouter";
import questionRouter from "./questionRouter";
import saldoRouter from "./scripts/saldoRouter";
import statisticsRouter from "./statisticsRouter";
import wordRouter from "./wordRouter";
import reportRouter from "./reportRouter";
import adminDashboardRouter from "./admin/adminDashboardRouter";
import wikiRouter from "./scripts/wikiRouter";
import learningRouter from "./learningRouter";
// import emailRouter from "./emailRouter";

const apiRouter = express.Router();

// apiRouter.use("/test", testRouter);
apiRouter.use("/wiki", bearerAuthentication, wikiRouter);
// apiRouter.use("/repetition", repetitionRouter);
// apiRouter.use("/saldo", saldoRouter);
// apiRouter.use("/email", emailRouter);
// apiRouter.use("/scripts", scriptsRouter);

apiRouter.use("/authentication", authenticationRouter);
apiRouter.use("/statistics", authenticateToken, statisticsRouter);
apiRouter.use("/question", questionRouter);
apiRouter.use("/word", wordRouter);
apiRouter.use("/learning", learningRouter);
apiRouter.use("/report", reportRouter);

apiRouter.use("/admin-dashboard", authenticateAdminToken, adminDashboardRouter);
export default apiRouter;
