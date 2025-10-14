import React, { useState, useContext } from "react";
import TextField from "@mui/material/TextField";
import MenuItem from "@mui/material/MenuItem";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Modal from "@mui/material/Modal";
import { GarageContext } from "../Contexts/GarageContext";
import { toast } from "react-toastify";
import axios from "axios";

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

  const cars = [{ _id: "68ed5df45e30fd4ce3647c65", label: "BMW" }];

  const [formData, setFormData] = useState({
    service: "",
    car: "",
    tel: "",
    description: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const userId = "68ebf4ce6e96010ead404588";

    if (!userId) {
      toast.error("User ID is missing in localStorage");
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
          userId,
          carId: formData.car,
          serviceId: formData.service,
          garageId: id,
          reservationDate,
          tel: formData.tel,
          description: formData.description,
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

          {/* Car Select */}
          <TextField
            select
            label="Car"
            name="car"
            value={formData.car}
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
            {cars.map((option) => (
              <MenuItem
                key={option._id}
                value={option._id} // ← send the correct _id
                sx={{ color: "#1A1A1A" }}
              >
                {option.label}
              </MenuItem>
            ))}
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
            sx={{
              mt: 2,
              bgcolor: "#FFED01",
              color: "#1A1A1A",
              fontWeight: "bold",
              "&:hover": { bgcolor: "#E6DA00" },
            }}
          >
            Reserve Now
          </Button>
        </form>
      </Box>
    </Modal>
  );
};

export default Reservation;
