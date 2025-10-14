import mongoose from "mongoose";
import Car from "../models/car.js"; 

const addCar = async (req, res) => {
  try {
    const { brand, model, plate, year } = req.body;

    if (!brand || !model || !plate || !year) {
      return res.status(400).json({
        success: false,
        message: "Brand, model, plate, and year are required",
      });
    }

    // Check for duplicate plate
    const existing = await Car.findOne({ plate });
    if (existing) {
      return res.status(400).json({
        success: false,
        message: "A car with this plate number already exists",
      });
    }

    const newCar = new Car({
      brand,
      model,
      plate,
      year,
    });

    await newCar.save();

    return res.status(201).json({
      success: true,
      message: "Car added successfully",
      car: newCar,
    });
  } catch (error) {
    console.error("Error adding car:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};

// Get a car by ID
const getCarById = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id || !mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid car ID",
      });
    }

    const car = await Car.findById(id);
    if (!car) {
      return res.status(404).json({ success: false, message: "Car not found" });
    }

    return res.status(200).json({ success: true, car });
  } catch (error) {
    console.error("Error fetching car:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};

export { addCar, getCarById };