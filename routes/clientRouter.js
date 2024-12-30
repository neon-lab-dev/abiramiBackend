import { Router } from "express";
import { createClient, deleteClient, getAllClients, updateClient } from "../controllers/clientController.js";

const clientRouter = Router();

clientRouter.get("/", getAllClients);
clientRouter.post("/", createClient);
clientRouter.put("/:id", updateClient);
clientRouter.delete("/:id", deleteClient);

export default clientRouter;