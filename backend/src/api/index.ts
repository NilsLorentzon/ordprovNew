import express from "express";
import expressSession from "express-session";
// import { z } from "zod";
// import { validate } from "../utils/utils";
import testRouter from "./testRouter";
import wikiRouter from "./wikiRouter";
import authenticationRouter from "./loginRouter";
import questionRouter from "./QuestionRouter";

const apiRouter = express.Router();

apiRouter.use("/test", testRouter);
apiRouter.use("/wiki", wikiRouter);
apiRouter.use("/authentication", authenticationRouter);
apiRouter.use("/question", questionRouter);

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
