import { Router } from "express";
import {getItemDetails , createInventory , updateInventory , deleteInventory} from "../controllers/inventoryController.js";
import {getInventoriesByCategory , createCategory , getCategories} from "../controllers/categoryController.js";
import { verifyTokenAdmin } from "../middlewares/requireAuth.js";
import singleUpload from "../middlewares/multer.js";

const inventoryRouter = Router();
inventoryRouter.use(verifyTokenAdmin);

inventoryRouter.get("/", getItemDetails);
inventoryRouter.post("/", singleUpload ,createInventory);
inventoryRouter.put("/:id", updateInventory);
inventoryRouter.delete("/:id", deleteInventory);
inventoryRouter.get("/category/:id", getInventoriesByCategory);
inventoryRouter.post("/category", createCategory);
inventoryRouter.get("/category" , getCategories);

export default inventoryRouter;