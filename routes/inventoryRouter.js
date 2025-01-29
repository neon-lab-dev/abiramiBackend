import { Router } from "express";
import {getItemDetails , createInventory , updateInventory , deleteInventory , getSingleInventory ,getInventories} from "../controllers/inventoryController.js";
import {getInventoriesByCategory , createCategory , getCategories} from "../controllers/categoryController.js";
import { verifyTokenAdmin } from "../middlewares/requireAuth.js";
import singleUpload from "../middlewares/multer.js";

const inventoryRouter = Router();
inventoryRouter.use(verifyTokenAdmin);

inventoryRouter.get("/items", getItemDetails);
inventoryRouter.get("/", getInventories);
inventoryRouter.post("/", singleUpload ,createInventory);
inventoryRouter.get("/category" , getCategories);
inventoryRouter.get("/:id", getSingleInventory);
inventoryRouter.put("/:id",singleUpload, updateInventory);
inventoryRouter.delete("/:id", deleteInventory);
inventoryRouter.get("/category/:id", getInventoriesByCategory);
inventoryRouter.post("/category", createCategory);

export default inventoryRouter;