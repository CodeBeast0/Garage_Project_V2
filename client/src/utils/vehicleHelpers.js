export const generateVehicleId = (vehicle) => {
  return `${vehicle.brand}-${vehicle.model}-${vehicle.year}-${
    vehicle.licensePlate || "no-plate"
  }`
    .toLowerCase()
    .replace(/\s+/g, "-");
};

export const checkDuplicateVehicle = (vehicleData, user) => {
  if (!user) return false;

  const vehiclesKey = `savedVehicles_${user.id}`;
  const storedVehicles = localStorage.getItem(vehiclesKey);

  if (!storedVehicles) return false;

  try {
    const existingVehicles = JSON.parse(storedVehicles);
    const newVehicleId = generateVehicleId(vehicleData);

    return existingVehicles.some(
      (vehicle) => generateVehicleId(vehicle) === newVehicleId
    );
  } catch (error) {
    console.error("Error checking duplicate vehicle:", error);
    return false;
  }
};

export const getVehicleStorageKey = (user) => {
  return user ? `selectedVehicle_${user.id}` : "selectedVehicle";
};

export const getSavedVehiclesKey = (user) => {
  return user ? `savedVehicles_${user.id}` : "savedVehicles";
};
