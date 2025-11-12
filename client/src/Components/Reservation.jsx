import React, { useState, useEffect, useContext } from "react";
import TextField from "@mui/material/TextField";
import MenuItem from "@mui/material/MenuItem";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Modal from "@mui/material/Modal";
import { GarageContext } from "../Contexts/GarageContext";
import { toast } from "react-toastify";
import axios from "axios";
import { useAuth } from "@clerk/clerk-react";
import { carApiService, setAuthToken } from "../utils/apiService";

const Reservation = ({ open, handleClose, id }) => {
  const backendUrl = import.meta.env.VITE_BACKEND_URL;
  const style = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: 400,
    bgcolor: "#1A1A1A",
    border: "2px solid #FFED01",
    boxShadow: 24,
    p: 4,
    borderRadius: 3,
    color: "#FFED01",
  };

  const { services } = useContext(GarageContext);
  const { getToken, userId } = useAuth();

  const [userCars, setUserCars] = useState([]);
  const [loadingCars, setLoadingCars] = useState(false);
  const [formData, setFormData] = useState({
    service: "",
    car: "",
    tel: "",
    description: "",
  });

  useEffect(() => {
    const fetchUserCars = async () => {
      if (open) {
        setLoadingCars(true);
        try {
          const token = await getToken();
          setAuthToken(token);
          const cars = await carApiService.getUserVehicles();
          setUserCars(cars || []);

          const defaultCar = cars?.find((car) => car.isDefault);
          if (defaultCar) {
            setFormData((prev) => ({
              ...prev,
              car: defaultCar._id,
            }));
          } else if (cars?.length > 0) {
            setFormData((prev) => ({
              ...prev,
              car: cars[0]._id,
            }));
          }
        } catch (error) {
          console.error("Failed to fetch user vehicles:", error);
          toast.error("Failed to load your vehicles");
          setUserCars([]);
        } finally {
          setLoadingCars(false);
        }
      }
    };

    fetchUserCars();
  }, [open, getToken]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const token = await getToken();

    if (!token) {
      toast.error("Authentication required. Please sign in.");
      return;
    }

    if (formData.tel.length !== 8) {
      toast.error("Phone number must be exactly 8 digits!");
      return;
    }

    if (formData.description.length > 265) {
      toast.error("Description cannot exceed 265 characters!");
      return;
    }

    if (!formData.service) {
      toast.error("Please select a service!");
      return;
    }

    if (!formData.car) {
      toast.error("Please select a car!");
      return;
    }

    try {
      console.log("Submitting reservation with:", { carId: formData.car });
      const reservationDate = new Date();
      const response = await axios.post(
        `${backendUrl}/api/Reservation/createReservation`,
        {
          carId: formData.car,
          serviceId: formData.service,
          garageId: id,
          reservationDate,
          tel: formData.tel,
          description: formData.description,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.data.success) {
        toast.success("Reservation created successfully!");
        handleClose();
      } else {
        toast.error(response.data.message || "Something went wrong");
      }
    } catch (error) {
      console.error(error);
      toast.error(error.message || "Failed to create reservation");
    }
  };

  const getCarDisplayText = (car) => {
    const mainInfo = `${car.year} ${car.brand} ${car.model}`;
    const plateInfo = car.plate ? ` • ${car.plate}` : "";
    const defaultIndicator = car.isDefault ? " (Default)" : "";

    return `${mainInfo}${plateInfo}${defaultIndicator}`;
  };

  return (
    <Modal open={open} onClose={handleClose}>
      <Box sx={style}>
        <Typography
          variant="h6"
          sx={{ mb: 2, textAlign: "center", fontWeight: "bold" }}
        >
          Service Reservation
        </Typography>

        <form
          onSubmit={handleSubmit}
          style={{ display: "flex", flexDirection: "column", gap: "15px" }}
        >
          {/* Service Select */}
          <TextField
            select
            label="Service"
            name="service"
            value={formData.service}
            onChange={handleChange}
            variant="outlined"
            fullWidth
            sx={{
              input: { color: "#FFFFFF" },
              label: { color: "#FFED01" },
              fieldset: { borderColor: "#1B252F" },
              "& .MuiSelect-select": { color: "#FFFFFF" },
            }}
          >
            {services.map((option) => (
              <MenuItem
                key={option._id}
                value={option._id}
                sx={{ color: "#1A1A1A" }}
              >
                {option.name}
              </MenuItem>
            ))}
          </TextField>

          {/* Car Select - Modern clean design */}
          <TextField
            select
            label="Vehicle"
            name="car"
            value={formData.car}
            onChange={handleChange}
            variant="outlined"
            fullWidth
            disabled={loadingCars}
            sx={{
              input: { color: "#FFFFFF" },
              label: { color: "#FFED01" },
              fieldset: { borderColor: "#1B252F" },
              "& .MuiSelect-select": { color: "#FFFFFF" },
            }}
          >
            {loadingCars ? (
              <MenuItem value="" sx={{ color: "#1A1A1A" }}>
                Loading vehicles...
              </MenuItem>
            ) : userCars.length > 0 ? (
              userCars.map((car) => (
                <MenuItem
                  key={car._id}
                  value={car._id}
                  sx={{
                    color: "#1A1A1A",
                    borderLeft: car.isDefault ? "3px solid #FFED01" : "none",
                    backgroundColor: car.isDefault ? "#FFF9C4" : "transparent",
                  }}
                >
                  <div>
                    <div style={{ fontWeight: car.isDefault ? "600" : "400" }}>
                      {car.year} {car.brand} {car.model}
                    </div>
                    <div
                      style={{
                        fontSize: "0.8rem",
                        color: "#666",
                        marginTop: "2px",
                      }}
                    >
                      {car.plate && `Plate: ${car.plate}`}
                      {car.mileage && ` • ${car.mileage}km`}
                    </div>
                  </div>
                </MenuItem>
              ))
            ) : (
              <MenuItem value="" sx={{ color: "#1A1A1A" }}>
                No vehicles available
              </MenuItem>
            )}
          </TextField>

          {/* Phone Number */}
          <TextField
            label="Phone Number"
            name="tel"
            type="text"
            value={formData.tel}
            onChange={handleChange}
            variant="outlined"
            fullWidth
            sx={{
              input: { color: "#FFFFFF" },
              label: { color: "#FFED01" },
              fieldset: { borderColor: "#1B252F" },
            }}
          />

          {/* Description TextArea */}
          <TextField
            label="Description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            variant="outlined"
            fullWidth
            multiline
            rows={4}
            sx={{
              textarea: { color: "#FFFFFF" },
              label: { color: "#FFED01" },
              fieldset: { borderColor: "#1B252F" },
            }}
            helperText={
              <span style={{ color: "#FFFFFF" }}>
                {formData.description.length}/265
              </span>
            }
          />

          {/* Submit Button */}
          <Button
            type="submit"
            variant="contained"
            disabled={loadingCars || userCars.length === 0}
            sx={{
              mt: 2,
              bgcolor: "#FFED01",
              color: "#1A1A1A",
              fontWeight: "bold",
              "&:hover": { bgcolor: "#E6DA00" },
              "&:disabled": { bgcolor: "#666666", color: "#999999" },
            }}
          >
            {loadingCars ? "Loading Vehicles..." : "Reserve Now"}
          </Button>
        </form>
      </Box>
    </Modal>
  );
};

export default Reservation;
