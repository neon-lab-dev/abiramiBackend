import { Router } from "express";
import {getItemDetails , createInventory , updateInventory , deleteInventory , getSingleInventory ,getInventories , searchInventories , getInventoryLogs} from "../controllers/inventoryController.js";
import {getInventoriesByCategory , createCategory , getCategories , searchCategory} from "../controllers/categoryController.js";
import { verifyTokenAdmin } from "../middlewares/requireAuth.js";
import singleUpload from "../middlewares/multer.js";

const inventoryRouter = Router();
inventoryRouter.use(verifyTokenAdmin);

inventoryRouter.get("/items", getItemDetails);
inventoryRouter.get("/", getInventories);
inventoryRouter.post("/", singleUpload ,createInventory);
inventoryRouter.get("/:id/logs", getInventoryLogs);
inventoryRouter.get("/:catgoryId/search", searchInventories);
inventoryRouter.get("/category" , getCategories);
inventoryRouter.get("/:id", getSingleInventory);
inventoryRouter.put("/:id",singleUpload, updateInventory);
inventoryRouter.delete("/:id", deleteInventory);
inventoryRouter.get("/category/search", searchCategory);
inventoryRouter.get("/category/:id", getInventoriesByCategory);
inventoryRouter.post("/category", createCategory);

export default inventoryRouter;