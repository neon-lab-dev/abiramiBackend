import { Router } from "express";
import { getAllInvoices , createInvoice , deleteInvoice , updateInvoice , searchInvoices } from "../controllers/invoiceController.js";
import { verifyTokenAdmin } from "../middlewares/requireAuth.js";

const invoiceRouter = Router();
invoiceRouter.use(verifyTokenAdmin);

invoiceRouter.get("/", getAllInvoices);
invoiceRouter.post("/", createInvoice);
invoiceRouter.put("/:id", updateInvoice);
invoiceRouter.delete("/:id", deleteInvoice);
invoiceRouter.get("/search", searchInvoices);

export default invoiceRouter;