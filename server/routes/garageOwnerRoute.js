import express from "express";
import { creatGarage } from "../controllers/garageOwnerController.js";
const garageOwnerRoutes = express.Router();
garageOwnerRoutes.post("/addGarage",creatGarage);

export {garageOwnerRoutes};
