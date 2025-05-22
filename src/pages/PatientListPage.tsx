import React, { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import {
  searchPatients,
  deletePatientById,
  getPatientById,
} from "../services/patientApis";
import { FaEdit, FaTrashAlt, FaEye, FaSearch } from "react-icons/fa";
import PatientViewModal from "../components/patients/PatientViewModal";
import { showError, showSuccess } from "../utils/toastUtils";
import ConfirmDialog from "../utils/ConfirmDialog";
import { RegisterPatientDrawer } from "../components/patients/RegisterPatientDrawer"; // ✅ Make sure this path is correct

// Debounce utility
const debounce = (func: (...args: any[]) => void, delay: number) => {
  let timeoutId: ReturnType<typeof setTimeout>;
  return (...args: any[]) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => func(...args), delay);
  };
};

const fields = ["firstName", "lastName", "email", "mobile", "city"];

const PatientListPage = () => {
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const [patients, setPatients] = useState([]);
  const [selectedPatient, setSelectedPatient] = useState<any>(null);
  const [showViewModal, setShowViewModal] = useState(false);
  const [showRegisterDrawer, setShowRegisterDrawer] = useState(false);

  const [filters, setFilters] = useState({
    firstName: "",
    lastName: "",
    email: "",
    mobile: "",
    city: "",
  });

  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [pendingDeleteId, setPendingDeleteId] = useState<string | null>(null);
  const [fullName, setFullName] = useState("");

  const navigate = useNavigate();

  const debouncedSearch = useRef(
    debounce((updatedFilters: typeof filters) => {
      searchPatients(updatedFilters).then(setPatients);
    }, 400)
  ).current;

  const handleRefresh = () => {
    setRefreshTrigger((prev) => prev + 1); // This triggers useEffect
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const updated = { ...filters, [e.target.name]: e.target.value };
    setFilters(updated);
    debouncedSearch(updated);
  };

  const handleDeleteClick = (id: string) => {
    const fetchPatient = patients.find((x) => x.patientId === id);
    if (!fetchPatient) return;

    const name = `${fetchPatient.firstName} ${
      fetchPatient.middleName ? fetchPatient.middleName + " " : ""
    }${fetchPatient.lastName}`;
    setFullName(name);
    setPendingDeleteId(id);
    setIsConfirmOpen(true);
  };

  const confirmDelete = async () => {
    if (!pendingDeleteId) return;

    const success = await deletePatientById(pendingDeleteId);
    if (success) {
      console.log("Patient Deleted Successfully");
      searchPatients(filters).then(setPatients);
      showSuccess("Patient Deleted Successfully", fullName);
    } else {
      showError("Failed To Delete Patient", fullName);
    }

    setIsConfirmOpen(false);
    setPendingDeleteId(null);
  };

  const handleView = async (id: string) => {
    try {
      const result = await getPatientById(id);
      if (Array.isArray(result) && result.length > 0) {
        setSelectedPatient(result[0]);
        setShowViewModal(true);
      } else {
        alert("Patient not found.");
      }
    } catch (error) {
      console.log(error);
      alert("Error fetching patient details.");
    }
  };

  useEffect(() => {
    searchPatients(filters).then(setPatients); // initial load
  }, [refreshTrigger]);

  return (
    <div className="flex flex-col gap-1 w-full p-3">
      <div className="flex justify-end">
        <button
          className="btn btn-sm bg-primary text-white hover:bg-primary/90 shadow-md px-4 py-1.5 rounded-md"
          onClick={() => setShowRegisterDrawer(true)}
        >
          +Register Patient
        </button>
      </div>

      {/* Search Filter Layout */}
      <div className="bg-white p-4 border border-gray-200 rounded-md shadow-sm space-y-2">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-2 w-full text-sm">
          {fields.map((key) => (
            <div key={key} className="relative w-full">
              <div className="absolute inset-y-0 left-0 pl-2 flex items-center pointer-events-none">
                <FaSearch className="text-gray-400 w-4 h-4" />
              </div>
              <input
                name={key}
                value={filters[key as keyof typeof filters]}
                onChange={handleInputChange}
                placeholder={key
                  .replace(/([A-Z])/g, " $1")
                  .replace(/^./, (str) => str.toUpperCase())}
                className="pl-8 pr-2 py-2 border border-gray-300 rounded text-xs w-full focus:outline-none focus:ring-1 focus:ring-primary"
              />
            </div>
          ))}
        </div>
      </div>

      {/* Patient Table */}
      <div className="overflow-x-auto shadow rounded-lg border border-gray-200 mt-2">
        <table className="table table-sm table-zebra w-full min-w-[800px] text-sm">
          <thead className="bg-gray-100 text-gray-800 font-semibold">
            <tr>
              <th>Name</th>
              <th>Phone</th>
              <th>Email</th>
              <th>Identifier</th>
              <th>Age</th>
              <th>Gender</th>
              <th className="text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {patients.length === 0 ? (
              <tr>
                <td colSpan={7} className="text-center py-4 text-gray-500">
                  No patients found.
                </td>
              </tr>
            ) : (
              patients.map((p: any) => (
                <tr key={p.patientId} className="hover:bg-gray-50">
                  <td className="font-medium text-gray-800">
                    {`${p.firstName || ""} ${p.middleName || ""} ${p.lastName || ""}`}
                  </td>
                  <td>{p.phone || "N/A"}</td>
                  <td>{p.email || "N/A"}</td>
                  <td>{p.identifierNumber || "N/A"}</td>
                  <td>{p.age ?? "N/A"}</td>
                  <td>{p.gender ?? "N/A"}</td>
                  <td className="text-right space-x-2">
                    <button
                      className="btn btn-sm btn-outline btn-circle"
                      onClick={() => handleView(p.patientId)}
                      title="View"
                    >
                      <FaEye className="text-green-600" />
                    </button>
                    <button
                      className="btn btn-sm btn-outline btn-circle"
                      onClick={() => navigate(`/patients/${p.patientId}`)}
                      title="Edit"
                    >
                      <FaEdit className="text-blue-600" />
                    </button>
                    <button
                      className="btn btn-sm btn-outline btn-error btn-circle"
                      onClick={() => handleDeleteClick(p.patientId)}
                      title="Delete"
                    >
                      <FaTrashAlt />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {showViewModal && selectedPatient && (
        <PatientViewModal
          patient={selectedPatient}
          onClose={() => setShowViewModal(false)}
        />
      )}

      {/* Confirmation Dialog */}
      <ConfirmDialog
        isOpen={isConfirmOpen}
        message={`Are you sure you want to delete ${fullName}?`}
        onConfirm={confirmDelete}
        onCancel={() => setIsConfirmOpen(false)}
      />

      {/* Quick Register Drawer */}
      {showRegisterDrawer && (
        <RegisterPatientDrawer
          onClose={() => setShowRegisterDrawer(false)}
          onSuccess={handleRefresh}
        />
      )}
    </div>
  );
};

export default PatientListPage;
