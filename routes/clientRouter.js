import { Router } from "express";
import { createClient, deleteClient, getAllClients, updateClient , searchClients, getSingleClient  } from "../controllers/clientController.js";
import { verifyTokenAdmin } from "../middlewares/requireAuth.js";

const clientRouter = Router();
clientRouter.use(verifyTokenAdmin);

clientRouter.get("/", getAllClients);
clientRouter.post("/", createClient);
clientRouter.get("/search", searchClients); //keep the serach route above the get single client route , otherwise it will be treated as a parameter i.e id
clientRouter.put("/:id", updateClient);
clientRouter.get("/:id", getSingleClient);
clientRouter.delete("/:id", deleteClient);

export default clientRouter;
