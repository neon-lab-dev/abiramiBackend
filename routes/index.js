import { Router } from "express";
import clientRouter from "./clientRouter.js";
import supplierRouter from "./supplierRouter.js";
import adminRouter from "./adminRouter.js";
import invoiceRouter from "./invoiceRouter.js";
import inventoryRouter from "./inventoryRouter.js";
import purchaseRouter from "./purchaseRouter.js";
import dashboardRouter from "./dashboardRouter.js";
import verifyRouter from "./verifyRouter.js";

const appRouter = Router();

appRouter.use("/clients", clientRouter );
appRouter.use("/admin", adminRouter);
appRouter.use("/suppliers", supplierRouter);
appRouter.use("/invoices", invoiceRouter);
appRouter.use("/inventory", inventoryRouter);
appRouter.use("/purchase", purchaseRouter);
appRouter.use("/dashboard", dashboardRouter);
appRouter.use("/verify", verifyRouter);

export default appRouter;