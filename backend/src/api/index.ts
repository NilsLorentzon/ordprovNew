import express, { Router } from "express";
import expressSession from "express-session";
// import { z } from "zod";
// import { validate } from "../utils/utils";
import testRouter from "./testRouter";
import wikiRouter from "./wikiRouter";
import authenticationRouter from "./loginRouter";
import repetitionRouter from "./repetitionRouter";
import answerRouter from "./answerRouter";
import saldoRouter from "./saldoRouter";
import statisticsRouter from "./statisticsRouter";
import wordRouter from "./wordRouter";
import reportRouter from "./reportRouter";
import scriptsRouter from "./scriptsRouter";

const apiRouter = express.Router();

apiRouter.use("/test", testRouter);
apiRouter.use("/wiki", wikiRouter);
apiRouter.use("/authentication", authenticationRouter);
apiRouter.use("/statistics", statisticsRouter);
apiRouter.use("/answer", answerRouter);
apiRouter.use("/repetition", repetitionRouter);
apiRouter.use("/saldo", saldoRouter);
apiRouter.use("/word", wordRouter);
apiRouter.use("/report", reportRouter);
apiRouter.use("/scripts", scriptsRouter);

// apiRouter.get(
//   "/get-file",
//   authenticate,
//   validate(
//     undefined,
//     undefined,
//     z.object({
//       fileName: z.string(),
//     })
//   ),
//   (req, res) => {
//     const fileName = req.query.fileName;
//     const imagePath = `${FILE_UPLOAD_PATH}/${fileName}`;
//     res.sendFile(imagePath);
//   }
// );
export default apiRouter;
