import { Router } from "express";
import { getDashboardData , getSalesAndPurchase} from "../controllers/dashboardController.js";
import { verifyTokenAdmin } from "../middlewares/requireAuth.js";

const dashboardRouter = Router();
dashboardRouter.use(verifyTokenAdmin);

dashboardRouter.get("/", getDashboardData);
dashboardRouter.get("/graph", getSalesAndPurchase);

export default dashboardRouter;
