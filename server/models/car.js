import mongoose from "mongoose";
const carSchema = new mongoose.Schema({
    brand: {             
        type: String,
        required: true,
    },
    model: {
        type: String,
        required: true,
    },
    plate: {
        type: String,
        required: true,
        unique: true,
    },
    year: {
        type: Date,
        required: true,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
});
const Car = mongoose.model("Car", carSchema);
export default Car;