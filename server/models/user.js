import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    lastName: { type: String },
    email: { type: String, required: true, unique: true },
    phone: { type: String },
    password: { type: String, required: true },

    // NEW ROLE FIELD
    role: {
      type: String,
      enum: ["client", "mechanic", "garageOwner"],
      default: "client",
    },
  },
  {
    timestamps: true, // auto-createdAt & updatedAt
  }
);

const userModel = mongoose.models.user || mongoose.model("user", userSchema);

export default userModel;
