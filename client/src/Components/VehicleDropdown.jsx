import { useState, useEffect, useRef } from "react";
import { useUser } from "@clerk/clerk-react";
import {
  generateVehicleId,
  getVehicleStorageKey,
  getSavedVehiclesKey,
} from "../utils/vehicleHelpers";

const VehicleDropdown = ({
  selectedVehicle,
  setSelectedVehicle,
  setShowVehiclePopup,
}) => {
  const { isSignedIn, user } = useUser();
  const [showVehicleDropdown, setShowVehicleDropdown] = useState(false);
  const [savedVehicles, setSavedVehicles] = useState([]);
  const dropdownRef = useRef(null);

  useEffect(() => {
    if (isSignedIn && user) {
      const storageKey = getVehicleStorageKey(user);
      const vehiclesKey = getSavedVehiclesKey(user);
      const storedVehicle = localStorage.getItem(storageKey);
      const storedVehicles = localStorage.getItem(vehiclesKey);

      if (storedVehicle) {
        try {
          const vehicle = JSON.parse(storedVehicle);
          setSelectedVehicle(vehicle);
        } catch (error) {
          console.error("Error parsing stored vehicle:", error);
          setSelectedVehicle(null);
        }
      }

      if (storedVehicles) {
        try {
          const vehicles = JSON.parse(storedVehicles);
          setSavedVehicles(vehicles);
        } catch (error) {
          console.error("Error parsing saved vehicles:", error);
          setSavedVehicles([]);
        }
      }
    } else {
      setSelectedVehicle(null);
      setSavedVehicles([]);
    }
  }, [isSignedIn, user, setSelectedVehicle]);

  const removeVehicle = (vehicleToRemove) => {
    const vehicleIdToRemove = generateVehicleId(vehicleToRemove);
    const updatedVehicles = savedVehicles.filter(
      (v) => generateVehicleId(v) !== vehicleIdToRemove
    );
    setSavedVehicles(updatedVehicles);
    localStorage.setItem(
      getSavedVehiclesKey(user),
      JSON.stringify(updatedVehicles)
    );

    const selectedVehicleId = selectedVehicle
      ? generateVehicleId(selectedVehicle)
      : null;
    if (selectedVehicleId === vehicleIdToRemove) {
      if (updatedVehicles.length > 0) {
        setSelectedVehicle(updatedVehicles[0]);
        localStorage.setItem(
          getVehicleStorageKey(user),
          JSON.stringify(updatedVehicles[0])
        );
      } else {
        setSelectedVehicle(null);
        localStorage.removeItem(getVehicleStorageKey(user));
        setShowVehiclePopup(true);
      }
    }
  };

  const clearVehicle = () => {
    if (user) {
      const storageKey = getVehicleStorageKey(user);
      localStorage.removeItem(storageKey);
      setSelectedVehicle(null);
      setShowVehiclePopup(true);
      setShowVehicleDropdown(false);
    }
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowVehicleDropdown(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const selectVehicle = (vehicle) => {
    setSelectedVehicle(vehicle);
    setShowVehicleDropdown(false);

    if (user) {
      const storageKey = getVehicleStorageKey(user);
      localStorage.setItem(storageKey, JSON.stringify(vehicle));
    }
  };

  const getDisplayText = (vehicle) => {
    return vehicle
      ? `${vehicle.year} ${vehicle.brand} ${vehicle.model}`
      : "Select Vehicle";
  };

  if (!isSignedIn) return null;

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setShowVehicleDropdown(!showVehicleDropdown)}
        className="flex items-center gap-1 md:gap-2 hover:text-[#1A1A1A] transition-colors px-2 md:px-3 py-1 rounded-lg hover:bg-[#e6c801]"
      >
        <i className="fa-solid fa-car"></i>
        {selectedVehicle ? (
          <span className="hidden md:inline max-w-[200px] truncate">
            {getDisplayText(selectedVehicle)}
          </span>
        ) : (
          <span className="hidden md:inline">Select Vehicle</span>
        )}
        <i
          className={`fa-solid fa-chevron-down transition-transform duration-200 ${
            showVehicleDropdown ? "rotate-180" : ""
          }`}
        ></i>
      </button>

      {showVehicleDropdown && (
        <div className="absolute top-full right-0 mt-2 w-96 bg-[#1A1A1A] rounded-lg shadow-2xl border border-[#FFDE01] overflow-hidden z-[1000] max-md:fixed max-md:left-1/2 max-md:-translate-x-1/2 max-md:mt-16 max-md:-translate-y-1/2 max-md:w-[90vw]">
          <div className="p-4">
            <div className="flex gap-2 mb-4">
              <button
                onClick={() => {
                  setShowVehiclePopup(true);
                  setShowVehicleDropdown(false);
                }}
                className="flex-1 bg-[#FFDE01] text-black font-bold px-4 py-2 rounded-lg flex items-center justify-center gap-2 hover:bg-[#e6c801] transition-colors"
              >
                <i className="fa-solid fa-plus"></i>
                Add Vehicle
              </button>
              {selectedVehicle && (
                <button
                  onClick={clearVehicle}
                  className="bg-red-500 text-white px-4 py-2 rounded-lg flex items-center justify-center gap-2 hover:bg-red-600 transition-colors"
                  title="Clear current vehicle"
                >
                  <i className="fa-solid fa-trash"></i>
                </button>
              )}
            </div>

            <div className="space-y-2 max-h-60 overflow-y-auto">
              {savedVehicles.map((vehicle) => (
                <div
                  key={generateVehicleId(vehicle)}
                  className={`flex items-center justify-between p-3 rounded-lg group transition-all ${
                    selectedVehicle &&
                    generateVehicleId(selectedVehicle) ===
                      generateVehicleId(vehicle)
                      ? "bg-[#FFDE01] text-black"
                      : "bg-white/5 text-white hover:bg-white/10"
                  }`}
                >
                  <button
                    onClick={() => selectVehicle(vehicle)}
                    className="flex-1 text-left text-sm truncate"
                  >
                    <div>
                      {vehicle.year} {vehicle.brand} {vehicle.model}
                      {selectedVehicle &&
                        generateVehicleId(selectedVehicle) ===
                          generateVehicleId(vehicle) && (
                          <span className="ml-2 text-xs bg-green-500 text-white px-1 rounded">
                            Current
                          </span>
                        )}
                    </div>
                    <div className="text-xs opacity-75">
                      {vehicle.licensePlate &&
                        `Plate: ${vehicle.licensePlate} • `}
                      {vehicle.mileage}km
                    </div>
                  </button>
                  <button
                    onClick={() => removeVehicle(vehicle)}
                    className={`opacity-0 group-hover:opacity-100 transition-opacity ${
                      selectedVehicle &&
                      generateVehicleId(selectedVehicle) ===
                        generateVehicleId(vehicle)
                        ? "text-gray-700"
                        : "text-red-400"
                    }`}
                    title="Remove vehicle"
                  >
                    <i className="fa-solid fa-trash text-sm"></i>
                  </button>
                </div>
              ))}
              {savedVehicles.length === 0 && (
                <p className="text-gray-400 text-sm text-center py-4">
                  No saved vehicles yet
                </p>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default VehicleDropdown;
