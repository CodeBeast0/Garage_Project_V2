import express from "express"
import { addCar,getCarById } from "../controllers/carController.js"

const carRoute = express.Router();

carRoute.get('/:id',getCarById);
carRoute.post('/addCar',addCar);

export default carRoute;