import mongoose from "mongoose";
// import { MONGO_CONNECTION_STRING } from "../environment";
const MONGO_CONNECTION_STRING = "mongodb://localhost:27017/";
mongoose
  .connect(MONGO_CONNECTION_STRING, {
    dbName: "mydb",
  })
  .then(async () => {
    console.log("Connected to MongoDB");
  })
  .catch((err) => {
    console.error("Error connecting to MongoDB", err);
  });
