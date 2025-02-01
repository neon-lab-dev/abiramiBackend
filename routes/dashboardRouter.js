import { Router } from "express";
import { getDashboardData } from "../controllers/dashboardController.js";
import { verifyTokenAdmin } from "../middlewares/requireAuth.js";

const dashboardRouter = Router();
dashboardRouter.use(verifyTokenAdmin);

dashboardRouter.get("/", getDashboardData);

export default dashboardRouter;
