import mongoose from "mongoose";

const carSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true,
    index: true, // Add index for faster queries by user
  },
  brand: {
    type: String,
    required: true,
  },
  model: {
    type: String,
    required: true,
  },
  year: {
    type: Number, // Changed from Date to Number since CarAPI will provide year as number
    required: true,
  },
  plate: {
    type: String,
    required: true,
    unique: true,
  },
  isDefault: {
    type: Boolean,
    default: false,
  },
  mileage: {
    type: Number,
    default: 0,
    min: 0,
  },
  vin: {
    type: String,
    unique: true, // Add this line
    sparse: true, // Keep this - allows multiple null values
  },
  // Metadata from CarAPI
  make_id: {
    type: String,
    required: false,
  },
  model_id: {
    type: String,
    required: false,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// Index for efficient queries when checking unique plates
carSchema.index({ plate: 1 });

// Index for efficiently finding default car for a user
carSchema.index({ userId: 1, isDefault: 1 });

const Car = mongoose.model("Car", carSchema);
export default Car;
