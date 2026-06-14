import mongoose from "mongoose";
mongoose
  .connect(
    process.env.MONGO_CONNECTION_STRING || "mongodb://localhost:27017/",
    {
      dbName: "mydb",
    },
  )
  .then(async () => {
    console.log("Connected to MongoDB");
  })
  .catch((err) => {
    console.error("Error connecting to MongoDB", err);
  });
