import { Router } from "express";
import { createClient, deleteClient, getAllClients, updateClient , searchClients, getSingleClient } from "../controllers/clientController.js";
import { verifyTokenAdmin } from "../middlewares/requireAuth.js";

const clientRouter = Router();
clientRouter.use(verifyTokenAdmin);

clientRouter.get("/", getAllClients);
clientRouter.post("/", createClient);
clientRouter.put("/:id", updateClient);
clientRouter.get("/:id", getSingleClient);
clientRouter.delete("/:id", deleteClient);
clientRouter.get("/search", searchClients);

export default clientRouter;
