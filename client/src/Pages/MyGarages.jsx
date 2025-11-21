import React, { useEffect, useState } from "react";
import axios from "axios";

const MyGarages = () => {
  const itemsPerPage = 6;
  const [page, setPage] = useState(1);
  const [garages, setGarages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);

  // Form fields
  const [name, setName] = useState("");
  const [location, setLocation] = useState("");
  const [description, setDescription] = useState("");
  const [capacity, setCapacity] = useState("");
  const [open, setOpen] = useState("");
  const [close, setClose] = useState("");
  const [images, setImages] = useState([]);

  // Fetch garages
  const fetchGarages = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");

      const res = await axios.get(
        "http://localhost:4000/api/go/my-garages",
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      setGarages(res.data.garages || []);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching garages:", error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGarages();
  }, []);

  // Create garage
  const handleCreateGarage = async (e) => {
    e.preventDefault();

    try {
      const token = localStorage.getItem("token");
      const formData = new FormData();

      formData.append("name", name);
      formData.append("location", location);
      formData.append("description", description);
      formData.append("capacity", capacity);
      formData.append("openingHours[open]", open);
      formData.append("openingHours[close]", close);

      // images
      images.forEach((img, index) => {
        formData.append(`image${index + 1}`, img);
      });

      const res = await axios.post(
        "http://localhost:4000/api/garage/addGarage",
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (res.data.success) {
        setModalOpen(false);
        fetchGarages();
      }
    } catch (error) {
      console.error("Error creating garage:", error);
    }
  };

  const totalPages = Math.ceil(garages.length / itemsPerPage);
  const paginatedData = garages.slice(
    (page - 1) * itemsPerPage,
    page * itemsPerPage
  );

  if (loading) {
    return (
      <div className="p-6 text-center text-xl font-semibold text-black">
        Loading garages...
      </div>
    );
  }

  return (
    <div className="p-6 bg-white min-h-screen">
      {/* Title + Button */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-black">Garages</h1>
        <button
          onClick={() => setModalOpen(true)}
          className="px-4 py-2 bg-black text-white rounded-lg"
        >
          + Add Garage
        </button>
      </div>

      {/* No Garages */}
      {garages.length === 0 ? (
        <p className="text-black text-lg font-semibold">No garages found.</p>
      ) : (
        <>
          {/* Grid */}
          <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
            {paginatedData.map((garage) => (
              <div
                key={garage._id}
                className="p-5 border border-black rounded-xl shadow-md bg-white"
              >
                <img
                  src={garage.photos?.[0] || "/default-garage.jpg"}
                  alt={garage.name}
                  className="w-full h-40 object-cover rounded-lg mb-3"
                />

                <h2 className="text-xl font-bold text-black mb-2">
                  {garage.name}
                </h2>

                <p className="text-gray-700 font-medium">
                  Capacity:{" "}
                  <span className="text-yellow-500 font-bold">
                    {garage.capacity}
                  </span>
                </p>
              </div>
            ))}
          </div>

          {/* Pagination */}
          <div className="flex justify-center items-center gap-4 mt-8">
            <button
              disabled={page === 1}
              onClick={() => setPage(page - 1)}
              className="px-4 py-2 bg-black text-white rounded-lg disabled:opacity-40"
            >
              Prev
            </button>

            <span className="font-semibold text-black">
              Page {page} / {totalPages}
            </span>

            <button
              disabled={page === totalPages}
              onClick={() => setPage(page + 1)}
              className="px-4 py-2 bg-black text-white rounded-lg disabled:opacity-40"
            >
              Next
            </button>
          </div>
        </>
      )}

      {/* Add Garage Modal */}
      {modalOpen && (
        <div className="fixed inset-0  flex justify-center items-center">
          <div className="bg-white p-6 rounded-xl w-full max-w-md shadow-lg">
            <h2 className="text-xl font-bold mb-4">Add New Garage</h2>

            <form onSubmit={handleCreateGarage} className="space-y-4">
              <input
                type="text"
                placeholder="Garage Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full border p-2 rounded"
                required
              />

              <input
                type="text"
                placeholder="Location"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="w-full border p-2 rounded"
                required
              />

              <textarea
                placeholder="Description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full border p-2 rounded"
                required
              />

              <input
                type="number"
                placeholder="Capacity"
                value={capacity}
                onChange={(e) => setCapacity(e.target.value)}
                className="w-full border p-2 rounded"
                required
              />

              <div className="flex gap-3">
                <input
                  type="number"
                  placeholder="Open (hour)"
                  value={open}
                  onChange={(e) => setOpen(e.target.value)}
                  className="w-full border p-2 rounded"
                  required
                />

                <input
                  type="number"
                  placeholder="Close (hour)"
                  value={close}
                  onChange={(e) => setClose(e.target.value)}
                  className="w-full border p-2 rounded"
                  required
                />
              </div>

              <input
                type="file"
                multiple
                accept="image/*"
                onChange={(e) => setImages([...e.target.files])}
                className="w-full border p-2 rounded"
              />

              <div className="flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-4 py-2 border rounded"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="px-4 py-2 bg-black text-white rounded"
                >
                  Add Garage
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default MyGarages;
