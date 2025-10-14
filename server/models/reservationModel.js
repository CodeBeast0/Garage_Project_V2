import mongoose from "mongoose";
const reservationSchema = mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  garageId: { type: mongoose.Schema.Types.ObjectId, ref: "garage", required: true },
  serviceId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "service",
    required: true,
  },
  status: {
    type: String,
    default: "waiting",
  },
  carId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "car",
    required: true, 
  },
  description: String,
  customerPhotos: String,
  priceQuote: {
    type: Number,
  },
  reservationDate: {
    type: Date,
    required: true,
  },
  createdAt: {
    type: Date,
  },
  updatedAt: {
    type: Date,
  },
});

const reservationModel =
  mongoose.models.reservation ||
  mongoose.model("reservation", reservationSchema);
export default reservationModel;
