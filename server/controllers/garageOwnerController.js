import garageModel from "../models/garage.js";
import reservationModel from "../models/reservationModel.js";
import { v2 as cloudinary } from "cloudinary";
import validator from "validator";
import userModel from "../models/user.js";
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
const createMechanic = async (req, res) => {
  try {
    const { name, email, password , GarageId ,hours,age,salary } = req.body;
    const ownerId = req.user?._id;
    const garage = await garageModel.findOne({ 
      _id: GarageId, 
      Ownedby: ownerId 
    });

    if (!garage) {
      return res.status(403).json({ 
        success: false, 
        message: "Unauthorized: You don't own this garage or garage doesn't exist" 
      });
    }
    const exists = await userModel.findOne({ email });
    if (exists) {
      return res.json({ success: false, message: "Mechanic already exists" });
    }
    if (!validator.isEmail(email)) {
      return res.status(400).json({
        success: false,
        message: "Please enter a valid email",
      });
    }

    if (password.length < 8) {
      return res.status(400).json({
        success: false,
        message: "Please enter a strong password",
      });
    }
    if(age < 18){
      return res.status(400).json({success : false , message :"too young"})}
    if(salary < 530){
      return res.status(400).json({success: false , message :"under the legal minumem"})
    }
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
     const newUser = new userModel({
      name,
      email,
      password: hashedPassword,
      role : "mechanic",
      Garage : GarageId,
      age : age,
      salary : salary,
      hours : hours,
    });

    const user = await newUser.save();
    const token = createToken(user._id);
    res.status(201).json({ success: true, token });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: error.message });
  }
};
const getAllReservations = async (req,res) => {
  try {
        const userId = req.user?._id ; 
        const garages = await garageModel.find({ Ownedby: userId });
        if (!garages.length) {
      return res.status(200).json({
        success: true,
        reservations: [],
        message: "No garages found for this user"
      });
    }
    const garageIds = garages.map(garage => garage._id);
    const reservations = await reservationModel.find({
      garageId: { $in: garageIds } 
    })
    res.status(200).json({
      success: true,
      reservations: reservations,
      count: reservations.length,
      garageCount: garages.length
    });
  }
  catch (error){
    console.error("Error fetching garage reservations:", error);
    res.status(500).json({ success: false, message: error.message });
  }
}
const getAllClients = async (req, res) => {
  try {
    const userId = req.user?._id;
    const garages = await garageModel.find({ Ownedby: userId });
    if (!garages.length) {
      return res.status(200).json({
        success: true,
        clients: [],
        message: "No garages found for this user"
      });
    }
    const garageIds = garages.map(garage => garage._id);
    const reservations = await reservationModel.find({
      garageId: { $in: garageIds }
    }).select('userId').distinct('userId');

    if (!reservations.length) {
      return res.status(200).json({
        success: true,
        clients: [],
        message: "No clients found for your garages"
      });
    }
    const clients = await userModel.find({
      _id: { $in: reservations },
      role: "user" 
    });
    res.status(200).json({
      success: true,
      clients: clients,
      count: clients.length
    });
  } catch (error) {
    console.error("Error fetching clients:", error);
    res.status(500).json({ success: false, message: error.message });
  }
}
const acceptReservation = async (req, res) => {
  try {
    const { reservationId, mechanicId } = req.body;
    if (!reservationId || !mechanicId) {
      return res.status(400).json({
        success: false,
        message: "Reservation ID and Mechanic ID are required"
      });
    }
    const updatedReservation = await reservationModel.findByIdAndUpdate(
      reservationId,
      {
        status: "accepted",
        mechanic: mechanicId,
        updatedAt: new Date()
      },
      { new: true } 
    )
    res.status(200).json({
      success: true,
      message: "Reservation accepted successfully",
      reservation: updatedReservation
    });

  } catch (error) {
    console.error("Error accepting reservation:", error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};
const declineReservation = async(req,res) => {
  try {
    const {reservationId} = req.body
    
    const reservation = await reservationModel.deleteOne({
      _id:reservationId
    })
    if (reservation.deletedCount === 0) {
      return res.status(404).json({
        success: false,
        message: "Reservation not found"
      });
    }
   res.status(200).json({success :true , message:"reservation declined"})
   }  
    catch (error) {
    res.status(500).json({success :false,message : "we couldn't  decline the reservation"
    })
  }
}
const getAllMechanics = async (req,res) =>{
  try {
    const {ownerId} = req.body
    const garages = await garageModel.find({
        Ownedby : ownerId,
      })
    const mechanics  = await userModel.find({
      role : "mechanic",
      Garage : {$in : garages}
    })
    res.status(200).json({
      success: true,
      mechanics
    });
  } catch (error) {
    res.status(500).json({success :false,message : "we couldn't  List all mechanics"})
  }
}
const deleteMechanic = async (req,res) => {
  try {
      const {mechanicId} = req.body;
      const mechanic = await userModel.deleteOne({
        _id : mechanicId
      })
      if (await mechanic.deletedCount == 0 ){
        return res.status(404).json({
        success: false,
        message: "mechanic not found"
      });
      }
      else {
        res.status(200).json({success :true , message:"mechanic deleted"})
      }
  } catch (error) {
    res.status(500).json({success :false,message : "we couldn't  delete the mechanics"})
  }
}
const updateMechanic = async (req,res) => {
  try {
      const {mechanincId,name, email, password , GarageId ,hours,age,salary}=req.body;
  const update= await userModel.findByIdAndUpdate(
    mechanincId,
    {
      name : name,
      email : email,
      password : password,
      GarageId : GarageId ,
      hours : hours,
      salary : salary,
      age : age,
  },
  { new: true }
)
  res.status(200).json({
      success: true,
      message: "mecahnic updated",
      mechanic: update
    });
  } catch (error) {
    console.error("Error accepting reservation:", error);
    res.status(500).json({success :false,message : "we couldn't  update the mechanic"})
  }
}
export {creatGarage,listgaragereservations,getAllGarages,createMechanic,getAllReservations,acceptReservation,getAllClients,declineReservation,getAllMechanics,deleteMechanic,updateMechanic};