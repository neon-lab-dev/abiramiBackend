import { Router } from "express";
import { createClient, deleteClient, getAllClients, updateClient , searchClients } from "../controllers/clientController.js";

const clientRouter = Router();

clientRouter.get("/", getAllClients);
clientRouter.post("/", createClient);
clientRouter.put("/:id", updateClient);
clientRouter.delete("/:id", deleteClient);
clientRouter.get("/search", searchClients);

export default clientRouter;