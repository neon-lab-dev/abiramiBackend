import { Router } from "express";
import { createSupplier, deleteSupplier, getAllSuppliers, searchSuppliers, updateSupplier } from "../controllers/supplierController.js";
import { verifyTokenAdmin } from "../middlewares/requireAuth.js";

const supplierRouter = Router();
supplierRouter.use(verifyTokenAdmin);

supplierRouter.get("/", getAllSuppliers);
supplierRouter.post("/", createSupplier);
supplierRouter.put("/:id", updateSupplier);
supplierRouter.delete("/:id", deleteSupplier);
supplierRouter.get("/search", searchSuppliers);

export default supplierRouter;