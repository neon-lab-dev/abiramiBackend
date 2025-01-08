import { Router } from "express";
import {getItemDetails , createInventory} from "../controllers/inventoryController.js";
import { imageUpload , imageDelete } from "../controllers/imageController.js";
import { verifyTokenAdmin } from "../middlewares/requireAuth.js";

const inventoryRouter = Router();
inventoryRouter.use(verifyTokenAdmin);

inventoryRouter.get("/", getItemDetails);
inventoryRouter.post("/", createInventory);
inventoryRouter.post("/image", imageUpload);
inventoryRouter.delete("/image/:fileId", imageDelete);

export default inventoryRouter;