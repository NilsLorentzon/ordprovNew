import dotenv from "dotenv";
dotenv.config();
import express, { Express } from "express";
import cors from "cors";
import apiRouter from "./api";
// import { errorHandler } from "./utils/utils";
import "./db/db";
import { injectUser } from "./api/loginRouter";

const app: Express = express();

app.use(cors());
app.use(express.json({ limit: "50mb" }));

app.use(injectUser);
  
app.use("/api", apiRouter);
// app.use(errorHandler);

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server listening on portt ${PORT}`);
});
