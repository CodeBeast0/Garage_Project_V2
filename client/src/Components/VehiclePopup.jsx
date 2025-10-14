import { useState } from "react";
import { useUser } from "@clerk/clerk-react";
import { validateVehicleForm } from "../utils/vehicleValidation";
import { checkDuplicateVehicle } from "../utils/vehicleHelpers";

const VehiclePopup = ({ isOpen, onClose, onVehicleAdd }) => {
  const { user } = useUser();
  const [formData, setFormData] = useState({
    brand: "",
    model: "",
    year: "",
    licensePlate: "",
    vin: "",
    mileage: "",
  });

  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const formErrors = validateVehicleForm(formData);
    if (Object.keys(formErrors).length > 0) {
      setErrors(formErrors);
      return;
    }

    if (checkDuplicateVehicle(formData, user)) {
      setErrors({ duplicate: "This vehicle is already saved" });
      return;
    }

    setLoading(true);
    setErrors({});

    if (onVehicleAdd) {
      onVehicleAdd({
        ...formData,
        timestamp: new Date().toISOString(),
      });
    }

    setFormData({
      brand: "",
      model: "",
      year: "",
      licensePlate: "",
      vin: "",
      mileage: "",
    });
    setLoading(false);
    onClose();
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
    if (errors.duplicate) {
      setErrors((prev) => ({ ...prev, duplicate: "" }));
    }

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  if (!isOpen) return null;

  return (
    <>
      <div className="mt-110 bg-black/15 z-50" onClick={handleOverlayClick} />
      <div className="fixed inset-0 flex backdrop-blur-[1px] items-center justify-center z-50">
        <div className="bg-[#1A1A1A] p-8 rounded-xl shadow-2xl max-w-md w-full border border-[#FFDE01] transform transition-all duration-300 ease-out relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors"
          >
            <i className="fa-solid fa-xmark text-xl"></i>
          </button>

          <div className="relative">
            <h2 className="text-2xl font-bold mb-2 text-[#FFDE01] tracking-wide pr-8">
              Add New Vehicle
            </h2>
            <p className="text-gray-400 mb-6 text-sm">
              Please provide your vehicle details
            </p>

            {errors.duplicate && (
              <div className="mb-4 p-3 bg-red-500/20 border border-red-500 rounded-lg">
                <p className="text-red-400 text-sm">{errors.duplicate}</p>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="flex flex-col gap-4">
                <div>
                  <input
                    type="text"
                    name="brand"
                    value={formData.brand}
                    onChange={handleChange}
                    placeholder="Car Brand *"
                    className={`w-full bg-[#1A1A1A] border ${
                      errors.brand ? "border-red-500" : "border-[#FFDE01]/20"
                    } text-white px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FFDE01] hover:border-[#FFDE01]/40 transition-colors`}
                  />
                  {errors.brand && (
                    <p className="text-red-400 text-xs mt-1">{errors.brand}</p>
                  )}
                </div>

                <div>
                  <input
                    type="text"
                    name="model"
                    value={formData.model}
                    onChange={handleChange}
                    placeholder="Car Model *"
                    className={`w-full bg-[#1A1A1A] border ${
                      errors.model ? "border-red-500" : "border-[#FFDE01]/20"
                    } text-white px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FFDE01] hover:border-[#FFDE01]/40 transition-colors`}
                  />
                  {errors.model && (
                    <p className="text-red-400 text-xs mt-1">{errors.model}</p>
                  )}
                </div>

                <div>
                  <input
                    type="number"
                    name="year"
                    value={formData.year}
                    onChange={handleChange}
                    placeholder="Year *"
                    min="1900"
                    max={new Date().getFullYear() + 1}
                    className={`w-full bg-[#1A1A1A] border ${
                      errors.year ? "border-red-500" : "border-[#FFDE01]/20"
                    } text-white px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FFDE01] hover:border-[#FFDE01]/40 transition-colors`}
                  />
                  {errors.year && (
                    <p className="text-red-400 text-xs mt-1">{errors.year}</p>
                  )}
                </div>

                <input
                  type="text"
                  name="licensePlate"
                  value={formData.licensePlate}
                  onChange={handleChange}
                  placeholder="License Plate (Optional)"
                  className="w-full bg-[#1A1A1A] border border-[#FFDE01]/20 text-white px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FFDE01] hover:border-[#FFDE01]/40 transition-colors"
                />

                <div>
                  <input
                    type="text"
                    name="vin"
                    value={formData.vin}
                    onChange={handleChange}
                    placeholder="VIN (Optional)"
                    maxLength="17"
                    className={`w-full bg-[#1A1A1A] border ${
                      errors.vin ? "border-red-500" : "border-[#FFDE01]/20"
                    } text-white px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FFDE01] hover:border-[#FFDE01]/40 transition-colors`}
                  />
                  {errors.vin && (
                    <p className="text-red-400 text-xs mt-1">{errors.vin}</p>
                  )}
                </div>

                <div>
                  <input
                    type="number"
                    name="mileage"
                    value={formData.mileage}
                    onChange={handleChange}
                    placeholder="Mileage in km *"
                    min="0"
                    className={`w-full bg-[#1A1A1A] border ${
                      errors.mileage ? "border-red-500" : "border-[#FFDE01]/20"
                    } text-white px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FFDE01] hover:border-[#FFDE01]/40 transition-colors`}
                  />
                  {errors.mileage && (
                    <p className="text-red-400 text-xs mt-1">
                      {errors.mileage}
                    </p>
                  )}
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-[#FFDE01] hover:bg-[#FFDE01]/90 text-black font-bold px-6 py-3 rounded-lg transition-all duration-200 ease-out flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? (
                    <>
                      <svg
                        className="animate-spin h-5 w-5 text-black"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                          fill="none"
                        />
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        />
                      </svg>
                      <span>Adding Vehicle...</span>
                    </>
                  ) : (
                    <>
                      <i className="fa-solid fa-car"></i>
                      <span>Add Vehicle</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
};

export default VehiclePopup;
