import express from "express";
import { createGarage, garageList, getGarageByServiceId,getGarageById } from "../controllers/garageController.js";
import upload from "../middleware/multer.js";

const garageRouter = express.Router();
garageRouter.post(
  "/addGarage",
  upload.fields([
    { name: "image1", maxCount: 1 },
    { name: "image2", maxCount: 1 },
    { name: "image3", maxCount: 1 },
    { name: "image4", maxCount: 1 },
  ]),
  createGarage
);
garageRouter.get("/GaragesList", garageList);
garageRouter.get("/Garage/:serviceId",getGarageByServiceId);
garageRouter.get("/:id",getGarageById);
export default garageRouter;
