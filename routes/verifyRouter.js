import { Router } from "express";
import { verify } from "../controllers/verifyController.js";

const verifyRouter = Router();

verifyRouter.get("/", verify);

export default verifyRouter;