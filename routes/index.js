import { Router } from "express";
import clientRouter from "./clientRouter.js";

const appRouter = Router();

appRouter.use("/clients", clientRouter);

export default appRouter;