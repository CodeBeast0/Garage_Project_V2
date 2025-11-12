import React, { useContext, useState, useEffect } from "react";
import Footer from "../Components/Footer";
import GarageCard from "../Components/GarageCard";
import Garage_Pagination from "../Components/Garage_Pagination";
import Reservation from "../Components/Reservation";
import { GarageContext } from "../Contexts/GarageContext";
import { useParams } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";

const ServiceDetails = () => {
  const backendUrl = import.meta.env.VITE_BACKEND_URL;
  const [selectedGarageId, setSelectedGarageId] = useState(null);
  const { id } = useParams();
  const { services } = useContext(GarageContext);
  const [serviceData, setServiceData] = useState(false);
  const [garages, setGarages] = useState([]);
  const [img, setImage] = useState("");
  const { open, handleOpen, handleClose } = useContext(GarageContext);

  const fetchServiceData = () => {
    if (!services || services.length === 0) return;

    const item = services.find((service) => service._id === id);
    if (item) {
      setServiceData(item);
      setImage(item.image[0]);
    } else {
      console.log("No service found for ID:", id);
    }
  };

  useEffect(() => {
    console.log("test");
    
    if (!serviceData) return; // wait for serviceData

    const fetchGarages = async () => {
      try {
        const response = await axios.get(
          `${backendUrl}/api/garage/Garage/${serviceData._id}`
        );
        if (response.data.success) {
          setGarages(response.data.garages);
        } else {
          toast.error(response.data.message);
        }
      } catch (error) {
        console.log(error);
        toast.error(error.message);
      }
    };

    fetchGarages();
  }, [serviceData]);

  useEffect(() => {
    fetchServiceData();
  }, [id, services]);

  return (
    <div className="h-auto">
      <div className="bg-[#1A1A1A]  border-b-[25px] border-b-[#FFDE01]  text-white  w-[100%] py-50 ">
        <div className="relative sm:w-[100%] md:w-[90%]  mx-auto px-10">
          <div className="relative">
            {img ? (
              <img
                src={img}
                alt=""
                className="w-[100%] h-[300px] rounded-xl object-cover"
              />
            ) : null}
            <h1 className="absolute bottom-0 left-0 w-full bg-black/60 text-white text-center py-3 rounded-b-xl text-lg sm:text-2xl">
              {serviceData.name}
            </h1>
          </div>
          <div className="mt-10">
            <p className="leading-6">{serviceData.description}</p>
          </div>
          <div>
            <h1 className="text-[#FFDE01] text-2xl mt-8 mb-3 font-bold">
              Find a Garage
            </h1>
            <hr />
            <ul className="w-[100%] grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 mt-5 relative">
              {garages.map((item, index) => (
                <li key={index}>
                  <GarageCard
                    title={item.name}
                    fn1={() => {
                      setSelectedGarageId(item._id); // <-- set garage ID
                      handleOpen(); // open modal
                    }}
                    fn2={handleClose}
                    img={item.photos[0]}
                    id={item._id}
                  />
                </li>
              ))}
            </ul>
            <div className="flex justify-center mt-5">
              <Garage_Pagination />
            </div>
          </div>
        </div>
      </div>
      <Reservation open={open} handleClose={handleClose} id={selectedGarageId} />
      <Footer />
    </div>
  );
};

export default ServiceDetails;
