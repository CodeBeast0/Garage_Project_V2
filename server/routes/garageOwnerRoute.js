import express from "express";
import { createMechanic, creatGarage , getAllGarages, listgaragereservations } from "../controllers/garageOwnerController.js";
const garageOwnerRoutes = express.Router();
garageOwnerRoutes.post("/addGarage",creatGarage);
garageOwnerRoutes.get("/garagereservations",listgaragereservations) // reseravation mta3 garage mou3ayen
garageOwnerRoutes.get("/getAllGarages",getAllGarages); // tat3tik list ta3 il garage ili ymlikhom il user
garageOwnerRoutes.post("/createMechanic",createMechanic);// tzid mechano 
export {garageOwnerRoutes};
