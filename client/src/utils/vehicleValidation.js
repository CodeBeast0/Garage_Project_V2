export const validateVehicleForm = (data) => {
  const errors = {};

  if (!data.brandName?.trim()) {
    errors.brand = "Brand is required";
  }

  if (!data.modelName?.trim()) {
    errors.model = "Model is required";
  }

  const currentYear = new Date().getFullYear();
  if (!data.year) {
    errors.year = "Year is required";
  } else if (data.year < 1900 || data.year > currentYear + 1) {
    errors.year = `Year must be between 1900 and ${currentYear + 1}`;
  }

  // License plate is required
  if (!data.licensePlate?.trim()) {
    errors.licensePlate = "License plate is required";
  }

  // Mileage is optional, but if provided, must be valid
  if (data.mileage) {
    if (data.mileage < 0) {
      errors.mileage = "Mileage cannot be negative";
    } else if (data.mileage > 1000000) {
      errors.mileage = "Mileage seems too high";
    }
  }

  // VIN is optional, but if provided, must be 17 characters
  if (data.vin && data.vin.length !== 17) {
    errors.vin = "VIN must be 17 characters";
  }

  return errors;
};
