import express from "express";
import {
  creatGarage,
  listgaragereservations,
  getAllGarages,
  createMechanic,
  getAllReservations,
  acceptReservation,
  getAllClients,
  declineReservation
} from "../controllers/garageOwnerController.js";

import multer from "multer";
import { authenticateUser } from "../middleware/auth.js";

const GoRoute = express.Router();
const upload = multer({ dest: "uploads/" });
GoRoute.post(
  "/create",
  authenticateUser,
  upload.fields([
    { name: "image1", maxCount: 1 },
    { name: "image2", maxCount: 1 },
    { name: "image3", maxCount: 1 },
    { name: "image4", maxCount: 1 },
  ]),
  creatGarage
);

GoRoute.get("/my-garages", authenticateUser, getAllGarages);
GoRoute.post("/reservations", authenticateUser, listgaragereservations);
GoRoute.post("/create-mechanic", authenticateUser, createMechanic);
GoRoute.get("/reservations/all", authenticateUser, getAllReservations);
GoRoute.post("/reservation/accept", authenticateUser, acceptReservation);
GoRoute.post("/reservation/decline", authenticateUser, declineReservation);
GoRoute.get("/clients", authenticateUser, getAllClients);

export default GoRoute;
