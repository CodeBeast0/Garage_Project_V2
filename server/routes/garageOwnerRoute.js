import express from "express";
import { creatGarage , getAllGarages, listgaragereservations } from "../controllers/garageOwnerController.js";
const garageOwnerRoutes = express.Router();
garageOwnerRoutes.post("/addGarage",creatGarage);
garageOwnerRoutes.get("/garagereservations",listgaragereservations) // reseravation mta3 garage mou3ayen
garageOwnerRoutes.get("/getAllGarages",getAllGarages); // tat3tik list ta3 il garage ili ymlikhom il user
export {garageOwnerRoutes};
