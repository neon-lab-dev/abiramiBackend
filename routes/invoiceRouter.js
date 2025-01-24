import { Router } from "express";
import { getAllInvoices , createInvoice , deleteInvoice , updateInvoice , searchInvoices , getSingleInvoice , createInvoiceByClientName } from "../controllers/invoiceController.js";
import { verifyTokenAdmin } from "../middlewares/requireAuth.js";

const invoiceRouter = Router();
invoiceRouter.use(verifyTokenAdmin);

invoiceRouter.get("/", getAllInvoices);
invoiceRouter.post("/", createInvoice);
invoiceRouter.put("/:id", updateInvoice);
invoiceRouter.post("/:clientName", createInvoiceByClientName);
invoiceRouter.get("/search", searchInvoices); //keep the serach route above the get single invoice route , otherwise it will be treated as a parameter i.e id
invoiceRouter.get("/:id", getSingleInvoice);
invoiceRouter.delete("/:id", deleteInvoice);

export default invoiceRouter;