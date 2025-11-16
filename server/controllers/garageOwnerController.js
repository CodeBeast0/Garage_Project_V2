import garageModel from "../models/garage.js";
import reservationModel from "../models/reservationModel.js";
import { v2 as cloudinary } from "cloudinary";
const creatGarage = async (req, res) => {
    try{
       const {location, name, description, capacity, openingHours} = req.body ;
        const userId = req.user?._id || req.body.Ownedby; 
        if(!userId || !location || !name || !description || !capacity || !openingHours || openingHours.open == null ||openingHours.close == null){
            return res.status(400).json({success:false,message:"all required fields must be filled"})
        }
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
         const now = new Date().getHours();
    const isActive=now >= Number(openingHours.open) && now < Number(openingHours.close);
        const newGarage= new garageModel({
            location ,
            name,
            capacity,
             openingHours: {
                 open: Number(openingHours.open),
                close: Number(openingHours.close),
                 },
            Ownedby :userId,
            isActive,
            isVerified: false,  
            photos: imagesUrl,
        })
        await newGarage.save()
        res.status(201).json({success:true,message:'Garage added succesfully'})
    }
catch(error){
    console.error("Error creating garage:", error);
    res.status(500).json({ success: false, message: error.message });
}
}
const listgaragereservations = async(req,res)=>{
    try {
    const { garageId } = req.body;
        const allreservations = await reservationModel.find({
      garageId: garageId
    })
    .populate('userId', 'name email phone') 
    .populate('serviceId', 'name price duration')   
    .populate('carId', 'model brand year licensePlate') 
    .sort({ reservationDate: 1 }); 

    res.status(200).json({
      success: true,
      reservations: allreservations,
      count: allreservations.length
    });
}catch(error){
    console.error("Error fetching garage reservations:", error);
    res.status(500).json({ success: false, message: error.message });
}
}
const getAllGarages = async (req,res)=>{
  try{
    const userId = req.user?._id || req.body.Ownedby;
    const garages = await garageModel.find({ Ownedby: userId });
    res.status(200).json({success:true,garages: garages})
  }
  catch(error){
    console.error("Error fetching garages list:", error);
    res.status(500).json({ success: false, message: error.message });
  }
}

export {creatGarage,listgaragereservations,getAllGarages};