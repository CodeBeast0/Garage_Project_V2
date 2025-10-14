import express from "express"
import { createReservation,getReservationById } from "../controllers/reservationController.js";

const reservationRouter = express.Router();

reservationRouter.post('/createReservation',createReservation);
reservationRouter.get('/reservations/:id',getReservationById);

export default reservationRouter;