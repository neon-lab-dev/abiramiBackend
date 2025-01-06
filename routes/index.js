import { Router } from "express";
import clientRouter from "./clientRouter.js";
import supplierRouter from "./supplierRouter.js";
import adminRouter from "./adminRouter.js";
import invoiceRouter from "./invoiceRouter.js";

const appRouter = Router();

appRouter.use("/clients", clientRouter );
appRouter.use("/admin", adminRouter);
appRouter.use("/suppliers", supplierRouter);
appRouter.use("/invoices", invoiceRouter);

export default appRouter;