// Generate a display ID for a vehicle (for UI purposes only)
export const generateVehicleId = (vehicle) => {
  return `${vehicle.brand}-${vehicle.model}-${vehicle.year}-${
    vehicle.plate || "no-plate"
  }`
    .toLowerCase()
    .replace(/\s+/g, "-");
};

// Check if two vehicles are the same (comparing actual properties)
export const isSameVehicle = (vehicle1, vehicle2) => {
  if (!vehicle1 || !vehicle2) return false;

  return (
    vehicle1.plate?.toLowerCase() === vehicle2.plate?.toLowerCase() &&
    vehicle1.year === vehicle2.year &&
    vehicle1.brand?.toLowerCase() === vehicle2.brand?.toLowerCase() &&
    vehicle1.model?.toLowerCase() === vehicle2.model?.toLowerCase()
  );
};

// Format vehicle display text
export const formatVehicleDisplay = (vehicle) => {
  if (!vehicle) return "Select Vehicle";
  return `${vehicle.year} ${vehicle.brand} ${vehicle.model}`;
};

// Get vehicle details for display
export const getVehicleDetails = (vehicle) => {
  if (!vehicle) return "";
  const parts = [];
  if (vehicle.plate) parts.push(`Plate: ${vehicle.plate}`);
  if (vehicle.mileage) parts.push(`${vehicle.mileage}km`);
  return parts.join(" • ");
};
