import { Router } from "express";
import { createClient, deleteClient, getAllClients, updateClient , searchClients } from "../controllers/clientController.js";
import { verifyTokenAdmin } from "../middlewares/requireAuth.js";

const clientRouter = Router();
clientRouter.use(verifyTokenAdmin);

clientRouter.get("/", getAllClients);
clientRouter.post("/", createClient);
clientRouter.put("/:id", updateClient);
clientRouter.delete("/:id", deleteClient);
clientRouter.get("/search", searchClients);

export default clientRouter;