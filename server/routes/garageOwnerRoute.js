import express from "express";
import { acceptReservation, createMechanic, creatGarage , declineReservation, deleteMechanic, getAllGarages, getAllMechanics, listgaragereservations, updateMechanic } from "../controllers/garageOwnerController.js";
const garageOwnerRoutes = express.Router();
garageOwnerRoutes.post("/addGarage",creatGarage);
garageOwnerRoutes.get("/garagereservations",listgaragereservations) // reseravation mta3 garage mou3ayen
garageOwnerRoutes.get("/getAllGarages",getAllGarages); // tat3tik list ta3 il garage ili ymlikhom il user
garageOwnerRoutes.post("/createMechanic",createMechanic);// tzid mechano 
garageOwnerRoutes.get("/getAllMechanics",getAllMechanics);
garageOwnerRoutes.put("/updateMecahnic",updateMechanic);
garageOwnerRoutes.delete("/deletMechanic",deleteMechanic);
garageOwnerRoutes.delete("/declineReservation",declineReservation);
garageOwnerRoutes.put("/accepetReservation",acceptReservation);
export {garageOwnerRoutes};
