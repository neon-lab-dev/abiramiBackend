import { Router } from "express";
import {getItemDetails , createInventory , updateInventory , deleteInventory , getSingleInventory ,getInventories , searchInventories , getInventoryLogs , updateLogs} from "../controllers/inventoryController.js";
import {getInventoriesByCategory , createCategory , getCategories , searchCategory , deleteCategory} from "../controllers/categoryController.js";
import { verifyTokenAdmin } from "../middlewares/requireAuth.js";
import singleUpload from "../middlewares/multer.js";

const inventoryRouter = Router();
inventoryRouter.use(verifyTokenAdmin);

inventoryRouter.get("/items", getItemDetails);
inventoryRouter.get("/", getInventories);
inventoryRouter.post("/", singleUpload ,createInventory);
inventoryRouter.get("/category/search", searchCategory);
inventoryRouter.get("/:id/logs", getInventoryLogs);
inventoryRouter.get("/:catgoryId/search", searchInventories);
inventoryRouter.get("/category" , getCategories);
inventoryRouter.get("/:id", getSingleInventory);
inventoryRouter.put("/:id/logs", updateLogs);
inventoryRouter.put("/:id",singleUpload, updateInventory);
inventoryRouter.delete("/:id", deleteInventory);
inventoryRouter.get("/category/:id", getInventoriesByCategory);
inventoryRouter.post("/category", createCategory);
inventoryRouter.delete("/category/:id", deleteCategory);

export default inventoryRouter;