import { Router } from "express";
import { createAdmin, loginAdmin} from "../controllers/adminController.js";

const adminRouter = Router();

adminRouter.post("/signup", createAdmin);
adminRouter.post("/login", loginAdmin);

export default adminRouter;