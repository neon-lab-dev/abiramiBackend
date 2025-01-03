import { Router } from "express";
import clientRouter from "./clientRouter.js";
import supplierRouter from "./supplierRouter.js";
import adminRouter from "./adminRouter.js";

const appRouter = Router();

appRouter.use("/clients", clientRouter );
appRouter.use("/admin", adminRouter);
appRouter.use("/suppliers", supplierRouter);

export default appRouter;