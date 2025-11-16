import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  lastName: {
    type: String,
  },
  phone: {
    type: String,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
  role :{
     type: String,
    enum : ["user","mechanic","owner"],
    required :true
  },
  Garage: {
      type: mongoose.Schema.Types.ObjectId,
         ref: "garages", 
    }
});
const userModel = mongoose.models.user || mongoose.model("user", userSchema);
export default userModel;
