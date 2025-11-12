import express from "express"
import { createReservation,getReservationById } from "../controllers/reservationController.js";
import { authenticateUser } from "../middleware/auth.js";

const reservationRouter = express.Router();

// Protect both routes with authentication middleware
reservationRouter.post('/createReservation', authenticateUser, createReservation);
reservationRouter.get('/reservations', authenticateUser, getReservationById);

export default reservationRouter;