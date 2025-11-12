import garageModel from "../models/garage.js";
import serviceModel from "../models/service.js";
import mongoose from "mongoose"; 
import { v2 as cloudinary } from "cloudinary";
const createGarage = async (req, res) => {
  try {
    const {
      name,
      description,
      location,
      capacity,
      openingHours,
      isActive,
      isVerified,
    } = req.body;

    const image1 = req.files.image1 && req.files.image1[0];
    const image2 = req.files.image2 && req.files.image2[0];
    const image3 = req.files.image3 && req.files.image3[0];
    const image4 = req.files.image4 && req.files.image4[0];

    const images = [image1, image2, image3, image4].filter(
      (item) => item !== undefined
    );

    let imagesUrl = await Promise.all(
      images.map(async (item) => {
        let result = await cloudinary.uploader.upload(item.path, {
          resource_type: "image",
        });
        return result.secure_url;
      })
    );

    const garageInfo = {
      name,
      description,
      location,
      capacity,
      openingHours: Number(openingHours),
      photos: imagesUrl,
      isActive: isActive === "true" ? true : false,
      isVerified: isVerified === "true" ? true : false,
    };
    console.log(garageInfo);
    const garage = new garageModel(garageInfo);
    await garage.save();

    res.json({ success: true, message: "Garage Added" });
  } catch (error) {
    res.json({ success: false, message: error.message });
    console.log(error);
  }
};

const garageList = async (req, res) => {
  try {
    const list = await garageModel.find();
    res.json({ success: true, list });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

const getGarageByServiceId = async (req, res) => {
  try {
    const { serviceId } = req.params;
    if (!serviceId || !mongoose.Types.ObjectId.isValid(serviceId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid service ID",
      });
    }

    const service = await serviceModel.findById(serviceId).populate("garages");

    if (!service) {
      return res
        .status(404)
        .json({ success: false, message: "Service not found" });
    }
    res.json({ success: true, garages: service.garages });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: error.message });
  }
};

const getGarageById = async (req, res) => {
  try {
    const { id } = req.params;
    const gar = await garageModel.findById(id);
    if (gar) {
      res.json({ success: true, gar });
    } else {
      res.json({ success: false, message: "garage not found" });
    }
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

export { createGarage, garageList, getGarageByServiceId, getGarageById };
