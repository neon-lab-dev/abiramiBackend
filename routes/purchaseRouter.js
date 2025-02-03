import { Router } from "express";
import {  getALLPurchases , createPurchase, updatePurchase , deletePurchase , getSinglePurchase , searchPurchases} from "../controllers/purchaseController.js";
import { verifyTokenAdmin } from "../middlewares/requireAuth.js";

const purchaseRouter = Router();

purchaseRouter.use(verifyTokenAdmin);

purchaseRouter.get("/", getALLPurchases);
purchaseRouter.get("/search", searchPurchases);
purchaseRouter.get("/:id", getSinglePurchase);
purchaseRouter.post("/", createPurchase);
purchaseRouter.put("/:id", updatePurchase);
purchaseRouter.delete("/:id", deletePurchase);

export default purchaseRouter;