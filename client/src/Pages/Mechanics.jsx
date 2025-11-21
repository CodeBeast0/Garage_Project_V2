import React, { useState, useMemo } from "react";
import { Search } from "lucide-react";
import axios from "axios";

const Mechanics = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [page, setPage] = useState(1);
  const itemsPerPage = 5;

  const [modalOpen, setModalOpen] = useState(false);
  const [selected, setSelected] = useState(null);
  const [isAddMode, setIsAddMode] = useState(false); 

  
  const [editName, setEditName] = useState("");
  const [editEmail, setEditEmail] = useState("");
  const [editAge, setEditAge] = useState("");
  const [editSalary, setEditSalary] = useState("");
  const [editHours, setEditHours] = useState("");

  const [mechanics, setMechanics] = useState([
    { id: 1, name: "Yassine", email: "yassine@example.com", age: 27, salary: 1200, hours: 40 },
    { id: 2, name: "Ayhem", email: "ayhem@example.com", age: 25, salary: 1100, hours: 38 },
    { id: 3, name: "Mouhib", email: "mouhib@example.com", age: 29, salary: 1500, hours: 45 },
    { id: 4, name: "Louay", email: "louay@example.com", age: 31, salary: 1600, hours: 42 },
  ]);

  // Open modal for edit
  const openModal = (m) => {
    setIsAddMode(false);
    setSelected(m);
    setEditName(m.name);
    setEditEmail(m.email);
    setEditAge(m.age);
    setEditSalary(m.salary);
    setEditHours(m.hours);
    setModalOpen(true);
  };

  // Open modal for add
  const openAddModal = () => {
    setIsAddMode(true);
    setSelected(null);
    setEditName("");
    setEditEmail("");
    setEditAge("");
    setEditSalary("");
    setEditHours("");
    setModalOpen(true);
  };

  // Save updated mechanic
  const saveChanges = async () => {
    if (isAddMode) {
      try {
        const res = await axios.post("http://localhost:4000/api/garage-owner/create-mechanic", {
          name: editName,
          email: editEmail,
          age: editAge,
          salary: editSalary,
          hours: editHours,
        });

        // Add new mechanic to state
        setMechanics((prev) => [...prev, res.data]);
        setModalOpen(false);
      } catch (error) {
        console.error("Error creating mechanic:", error);
      }
    } else {
      setMechanics((prev) =>
        prev.map((m) =>
          m.id === selected.id
            ? { ...m, name: editName, email: editEmail, age: editAge, salary: editSalary, hours: editHours }
            : m
        )
      );
      setModalOpen(false);
    }
  };

  // Delete mechanic
  const deleteMechanic = (id) => {
    setMechanics((prev) => prev.filter((m) => m.id !== id));
  };

  // Filter mechanics
  const filteredMechanics = useMemo(() => {
    return mechanics.filter(
      (m) =>
        m.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        m.email.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [searchTerm, mechanics]);

  const paginatedMechanics = filteredMechanics.slice(
    (page - 1) * itemsPerPage,
    page * itemsPerPage
  );

  const totalPages = Math.ceil(filteredMechanics.length / itemsPerPage);

  return (
    <div className="p-4 sm:p-6 bg-[#F5F5F5] min-h-screen space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-800">Mechanic Management</h1>
        <button
          onClick={openAddModal}
          className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
        >
          Add Mechanic
        </button>
      </div>

      {/* Search */}
      <div className="bg-white shadow rounded-2xl p-4 flex flex-col sm:flex-row gap-4 justify-between items-center">
        <div className="flex items-center w-full bg-gray-100 px-3 py-2 rounded-xl">
          <Search className="text-gray-500 w-5 h-5" />
          <input
            type="text"
            placeholder="Search mechanic..."
            className="bg-transparent w-full outline-none ml-2"
            value={searchTerm}
            onChange={(e) => {
              setPage(1);
              setSearchTerm(e.target.value);
            }}
          />
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl shadow p-5">
        <h2 className="font-semibold text-lg mb-4">All Mechanics</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="p-2">No</th>
                <th className="p-2">Name</th>
                <th className="p-2">Email</th>
                <th className="p-2">Age</th>
                <th className="p-2">Salary</th>
                <th className="p-2">Hours</th>
                <th className="p-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {paginatedMechanics.map((m, index) => (
                <tr key={m.id} className="border-b border-gray-200">
                  <td className="p-2">{(page - 1) * itemsPerPage + index + 1}</td>
                  <td className="p-2">{m.name}</td>
                  <td className="p-2">{m.email}</td>
                  <td className="p-2">{m.age}</td>
                  <td className="p-2">£{m.salary}</td>
                  <td className="p-2">{m.hours} hrs</td>
                  <td className="p-2 flex gap-2">
                    <button
                      onClick={() => openModal(m)}
                      className="px-3 py-1 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => deleteMechanic(m.id)}
                      className="px-3 py-1 bg-red-600 text-white rounded-lg text-sm hover:bg-red-700"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
              {paginatedMechanics.length === 0 && (
                <tr>
                  <td colSpan={7} className="text-center p-4 text-gray-500">
                    No mechanics found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

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

      {/* Modal */}
      {modalOpen && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl p-6 w-full max-w-md shadow-xl">
            <h3 className="text-xl font-semibold mb-4">
              {isAddMode ? "Add Mechanic" : "Edit Mechanic"}
            </h3>

            <label>Name</label>
            <input
              value={editName}
              onChange={(e) => setEditName(e.target.value)}
              className="w-full p-2 border rounded-lg mb-3"
            />
            <label>Email</label>
            <input
              value={editEmail}
              onChange={(e) => setEditEmail(e.target.value)}
              className="w-full p-2 border rounded-lg mb-3"
            />
            <label>Age</label>
            <input
              type="number"
              value={editAge}
              onChange={(e) => setEditAge(e.target.value)}
              className="w-full p-2 border rounded-lg mb-3"
            />
            <label>Salary (£)</label>
            <input
              type="number"
              value={editSalary}
              onChange={(e) => setEditSalary(e.target.value)}
              className="w-full p-2 border rounded-lg mb-3"
            />
            <label>Hours</label>
            <input
              type="number"
              value={editHours}
              onChange={(e) => setEditHours(e.target.value)}
              className="w-full p-2 border rounded-lg mb-3"
            />

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
                {isAddMode ? "Add" : "Save"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Mechanics;
