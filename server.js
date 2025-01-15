import express from "express";
import morgan from "morgan";
import cors from "cors";
import bodyParser from "body-parser";
import ENV_CONFIG from "./config/config.js";
import appRouter from "./routes/index.js";

const app = express();

// middlewares

app.use(
    bodyParser.urlencoded({ limit: ENV_CONFIG.MAX_REQUEST_SIZE, extended: true })
);
app.use(cors({ origin: ENV_CONFIG.FRONTEND_URL, credentials: true }));

app.use(express.json());

if (ENV_CONFIG.NODE_ENV === "development") {
    app.use(morgan("tiny"));
}


// api route
app.get("/", (req, res) => {
    res.send("Welcome to the client API");
  });

app.use("/api", appRouter);

app.listen(process.env.PORT, () => {
    console.log(`Server is running on port ${process.env.PORT}`);
  });
