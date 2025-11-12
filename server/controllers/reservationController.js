import reservationModel from "../models/reservationModel.js";
import mongoose from "mongoose";

const createReservation = async (req, res) => {
  try {
    const { serviceId, garageId, carId, reservationDate, tel, description } =
      req.body;

    // Get user ID from authenticated request (added by middleware)
    const userId = req.user?.id;
    
    if (!userId || !serviceId || !garageId || !carId || !reservationDate) {
      return res
        .status(400)
        .json({ success: false, message: "All required fields are needed" });
    }

    const newReservation = new reservationModel({
      userId: userId, // Use Clerk user ID directly as string
      serviceId: new mongoose.Types.ObjectId(serviceId),
      garageId: new mongoose.Types.ObjectId(garageId),
      carId: new mongoose.Types.ObjectId(carId),
      reservationDate: new Date(reservationDate),
      tel: tel || "",
      description: description || "",
    });

    await newReservation.save();

    res.status(201).json({
      success: true,
      message: "Reservation created successfully",
      reservation: newReservation,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: error.message });
  }
};


const getReservationById = async (req, res) => {
  try {
    // Get user ID from authenticated request (added by middleware)
    const userId = req.user?.id;

    if (!userId) {
      return res
        .status(400)
        .json({ success: false, message: "User authentication required" });
    }

    const reservations = await reservationModel
      .find({ userId: userId }) // Use Clerk user ID directly as string
      .populate("serviceId", "name description")
      .populate("garageId", "name location");

    if (!reservations.length) {
      return res.status(404).json({
        success: false,
        message: "No reservations found for this user",
      });
    }

    res.json({ success: true, reservations });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: error.message });
  }
};

export { createReservation, getReservationById };
