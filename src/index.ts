import "dotenv/config";
import express, { NextFunction, Request, Response } from "express";
import connectDB from "./config/db";
import secrets from "./config/secret";
import middleware from "./shared/middleware";
import routes from "./shared/route";
import logger from "node-color-log";

const app = express();
const PORT = secrets.PORT;

app.get("/", async (_, res) => {
  res.status(200).json({
    success: true,
    message: "Welcome to the API",
  });
});

app.use(middleware); // implement middleware

connectDB(); // database connection

app.use("/api/v1", routes); // define routes

// catch global error
app.use((error: any, _req: Request, res: Response, _: NextFunction) => {
  logger
    .color("red")
    .bgColor("black")
    .bold()
    .dim()
    .reverse()
    .log(error.message);

  res.status(error.statusCode || 400).json({
    message: error.message,
  });
});

app.listen(PORT, () => {
  console.log(`Listening on port ${PORT}`);
});

export default app;
