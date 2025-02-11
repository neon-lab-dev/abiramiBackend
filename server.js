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

app.use((req, res, next) => {
  res.header("Access-Control-Allow-Credentials", true);
 next();
});

app.use(cors({
  origin: ["http://localhost:5173" , "https://abirami-enterprises.vercel.app"],
  credentials: true,
  methods: ["GET", "POST", "DELETE", "PUT"],
}));


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
