import mongoose from "mongoose";

const garageSchema = new mongoose.Schema({
  name: { type: String, required: true },
  location: {
    type: String,
    required: true,
  },
  photos: {
    type: Array,
    required: true,
  },
  description: String,
  capacity: {
    type: Number,
    required: true,
  },
  openingHours: {
  open: { type: Number, required: true },
  close: { type: Number, required: true }
},
  isActive: {
    type: Boolean,
  },
  isVerified: {
    type: Boolean,
    default: false,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  Ownedby: {
    type: mongoose.Schema.Types.ObjectId,
       ref: "users",
       required: true, 
  }
});

const garageModel =
  mongoose.models.garage || mongoose.model("garage", garageSchema);
export default garageModel;
