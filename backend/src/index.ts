import dotenv from "dotenv";
dotenv.config();
import helmet from "helmet";
import express, { Express } from "express";
import cors from "cors";
import apiRouter from "./api";
import "./db/db";
import { injectStorageUser, injectUser } from "./api/authenticationRouter";

const app: Express = express();

app.use(cors());
app.use(helmet());
app.use(express.json({ limit: "50mb" }));

app.use(injectUser);
app.use(injectStorageUser);
app.use("/api", apiRouter);

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server listening on portt ${PORT}`);
});
