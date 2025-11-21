import React, { useEffect, useState, useMemo } from "react";
import axios from "axios";
import { Search } from "lucide-react";

const Reservations = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [page, setPage] = useState(1);
  const itemsPerPage = 5;
  const [modalOpen, setModalOpen] = useState(false);
  const [selected, setSelected] = useState(null);
  const [editMechanic, setEditMechanic] = useState("");
  const [editStatus, setEditStatus] = useState("");
  const M = ["Yassine", "Ayhem", "Mouhib", "Louay"];

  const [reservations, setReservations] = useState([]);

  
  const fetchReservations = async () => {
    try {
      const res = await axios.get("http://localhost:4000/api/garage-owner/reservations/all");
      setReservations(res.data);
    } catch (error) {
      console.error("Error fetching reservations:", error);
    }
  };

  useEffect(() => {
    fetchReservations();
  }, []);

  const declineReservation = async (id) => {
  try {
    await axios.put(
      "http://localhost:4000/api/garage-owner/Reservation/decline",
      { reservationId: id } 
    );

    
    setReservations((prev) =>
      prev.map((r) =>
        r.id === id ? { ...r, status: "Declined" } : r
      )
    );
  } catch (error) {
    console.error("Error declining reservation:", error);
  }
};


  const saveChanges = () => {
    setReservations((prev) =>
      prev.map((r) =>
        r.id === selected.id
          ? { ...r, mechanic: editMechanic, status: editStatus }
          : r
      )
    );
    setModalOpen(false);
  };

  // Filtered results based on search
  const filteredReservations = useMemo(() => {
    return reservations.filter(
      (res) =>
        res.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        res.date.toLowerCase().includes(searchTerm.toLowerCase()) ||
        res.mechanic.toLowerCase().includes(searchTerm.toLowerCase()) ||
        res.status.toLowerCase().includes(searchTerm.toLowerCase()) ||
        res.price.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [searchTerm, reservations]);

  // Pagination logic
  const paginatedReservations = filteredReservations.slice(
    (page - 1) * itemsPerPage,
    page * itemsPerPage
  );

  const totalPages = Math.ceil(filteredReservations.length / itemsPerPage);

  const openModal = (item) => {
    setSelected(item);
    setEditMechanic(item.mechanic);
    setEditStatus(item.status);
    setModalOpen(true);
  };

  return (
    <div className="p-2 sm:p-6 bg-[#F5F5F5] min-h-screen space-y-6">
      {/* Header */}
      <h1 className="text-2xl font-bold text-gray-800">Reservations</h1>

      {/* Search */}
      <div className="bg-white shadow rounded-2xl p-4 flex flex-col sm:flex-row gap-4 justify-between items-center">
        <div className="flex items-center w-full bg-gray-100 px-3 py-2 rounded-xl">
          <Search className="text-gray-500 w-5 h-5" />
          <input
            type="text"
            placeholder="Search reservations..."
            className="bg-transparent w-full outline-none ml-2"
            value={searchTerm}
            onChange={(e) => {
              setPage(1);
              setSearchTerm(e.target.value);
            }}
          />
        </div>
      </div>

      {/* Reservations Table */}
      <div className="bg-white rounded-2xl min-w-[300px] shadow p-5">
        <h2 className="font-semibold text-lg mb-4">All Reservations</h2>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="p-2">No</th>
                <th className="p-2">Customer Name</th>
                <th className="p-2">Reservation Date</th>
                <th className="p-2">Mechanic</th>
                <th className="p-2">Status</th>
                <th className="p-2">Price</th>
                <th className="p-2">Actions</th>
              </tr>
            </thead>

            <tbody>
              {paginatedReservations.map((r, index) => (
                <tr key={r.id} className="border-b border-gray-200">
                  <td className="p-2">{(page - 1) * itemsPerPage + index + 1}</td>
                  <td className="p-2">{r.name}</td>
                  <td className="p-2">{r.date}</td>
                  <td className="p-2">{r.mechanic}</td>
                  <td
                    className={`p-2 font-medium ${
                      r.status === "Completed"
                        ? "text-green-600"
                        : r.status === "Pending"
                        ? "text-yellow-600"
                        : r.status === "In Progress"
                        ? "text-blue-600"
                        : r.status === "Declined"
                        ? "text-red-600"
                        : ""
                    }`}
                  >
                    {r.status}
                  </td>
                  <td className="p-2">{r.price}</td>
                  <td className="p-2 flex gap-2">
                    <button
                      onClick={() => openModal(r)}
                      className="px-3 py-1 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => declineReservation(r.id)}
                      disabled={r.status === "Declined"}
                      className="px-3 py-1 bg-red-600 text-white rounded-lg text-sm hover:bg-red-700 disabled:opacity-40"
                    >
                      Decline
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Modal */}
        {modalOpen && (
          <div className="fixed inset-0 bg-black/40 flex items-center justify-center p-4">
            <div className="bg-white rounded-xl p-6 w-full max-w-md shadow-xl">
              <h3 className="text-xl font-semibold mb-4">Edit Reservation</h3>

              {/* Mechanic */}
              <label className="font-medium text-sm">Mechanic</label>
              <select
                value={editMechanic}
                onChange={(e) => setEditMechanic(e.target.value)}
                className="w-full p-2 border rounded-lg mt-1 mb-4"
              >
                {M.map((mec, index) => (
                  <option key={index}>{mec}</option>
                ))}
              </select>

              {/* Status */}
              <label className="font-medium text-sm">Status</label>
              <select
                value={editStatus}
                onChange={(e) => setEditStatus(e.target.value)}
                className="w-full p-2 border rounded-lg mt-1 mb-4"
              >
                <option value="Pending">Pending</option>
                <option value="In Progress">In Progress</option>
                <option value="Completed">Completed</option>
              </select>

              {/* Buttons */}
              <div className="flex justify-end gap-3 mt-4">
                <button
                  onClick={() => setModalOpen(false)}
                  className="px-4 py-2 rounded-lg bg-gray-200"
                >
                  Cancel
                </button>

                <button
                  onClick={saveChanges}
                  className="px-4 py-2 rounded-lg bg-blue-600 text-white"
                >
                  Save
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Pagination */}
        <div className="flex justify-center gap-3 mt-4">
          <button
            disabled={page === 1}
            onClick={() => setPage(page - 1)}
            className="px-4 py-2 rounded-lg bg-gray-200 disabled:opacity-40"
          >
            Prev
          </button>

          <span className="px-4 py-2 font-semibold text-gray-700">
            Page {page} / {totalPages}
          </span>

          <button
            disabled={page === totalPages}
            onClick={() => setPage(page + 1)}
            className="px-4 py-2 rounded-lg bg-gray-200 disabled:opacity-40"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
};

export default Reservations;
