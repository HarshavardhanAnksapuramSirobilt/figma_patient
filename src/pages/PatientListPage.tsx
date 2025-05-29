import React, { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import {
  deletePatientById,
  getPatientById,
  getPatientsPaginated, 
} from "../services/patientApis";
import { FaEdit, FaTrashAlt, FaEye, FaSearch } from "react-icons/fa";
import PatientViewModal from "../components/patients/PatientViewModal";
import { showError, showSuccess } from "../utils/toastUtils";
import ConfirmDialog from "../utils/ConfirmDialog";

const debounce = (func: (...args: any[]) => void, delay: number) => {
  let timeoutId: ReturnType<typeof setTimeout>;
  return (...args: any[]) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => func(...args), delay);
  };
};

const PatientListPage = () => {
  const [patients, setPatients] = useState([]);
  const [totalCount, setTotalCount] = useState(0);
  const [page, setPage] = useState(0);
  const [pageSize] = useState(10);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedPatient, setSelectedPatient] = useState<any>(null);
  const [showViewModal, setShowViewModal] = useState(false);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [pendingDeleteId, setPendingDeleteId] = useState<string | null>(null);
  const [fullName, setFullName] = useState("");

  const navigate = useNavigate();

  const fetchPatients = async (query: string, currentPage: number) => {
    const result = await getPatientsPaginated({
      query,
      page: currentPage,
      size: pageSize,
    });
    setPatients(result.patients || []);
    setTotalCount(result.totalCount || 0);
  };

  const debouncedSearch = useRef(
    debounce((query: string) => {
      setPage(0);
      fetchPatients(query, 0);
    }, 400)
  ).current;

  const handleSearchInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value;
    setSearchQuery(query);
    debouncedSearch(query);
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
      fetchPatients(searchQuery, page);
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
        console.log("Seletced Patient details:", result[0]);
        setSelectedPatient(result[0]);
        setShowViewModal(true);
      } else {
        alert("Patient not found.");
      }
    } catch (error) {
      console.error("Error fetching patient details:", error);
      alert("Error fetching patient details.");
    }
  };

  useEffect(() => {
    const handleRefreshEvent = () => setRefreshTrigger((prev) => prev + 1);
    window.addEventListener("patient:registered", handleRefreshEvent);
    return () => window.removeEventListener("patient:registered", handleRefreshEvent);
  }, []);

  useEffect(() => {
    fetchPatients(searchQuery, page);
  }, [refreshTrigger, page]);

  const highlightText = (text: string, query: string) => {
    if (!query) return text;
    const regex = new RegExp(`(${query})`, "gi");
    return text.split(regex).map((part, index) =>
      part.toLowerCase() === query.toLowerCase() ? (
        <span key={index} className="bg-yellow-300">{part}</span>
      ) : (
        part
      )
    );
  };

  const totalPages = Math.ceil(totalCount / pageSize);

  return (
    <div className="flex flex-col gap-1 w-full p-3">
      <div className="flex justify-end">
        <button
          className="btn btn-sm bg-primary text-white hover:bg-primary/90 shadow-md px-4 py-1.5 rounded-md"
          onClick={() => navigate("/patients")}
        >
          + Register Patient
        </button>
      </div>

      <div className="bg-white p-4 border border-gray-200 rounded-md shadow-sm">
        <div className="relative w-full">
          <div className="absolute inset-y-0 left-0 pl-2 flex items-center pointer-events-none">
            <FaSearch className="text-gray-400 w-4 h-4" />
          </div>
          <input
            type="text"
            value={searchQuery}
            onChange={handleSearchInputChange}
            placeholder="Search by firstname, lastname, email,phone number, id"
            className="pl-8 pr-2 py-2 border border-gray-300 rounded text-xs w-full focus:outline-none focus:ring-1 focus:ring-primary"
          />
        </div>
      </div>

      {/* Table */}
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
                    {highlightText(`${p.firstName} ${p.middleName || ""} ${p.lastName}`, searchQuery)}
                  </td>
                  <td>{highlightText(p.phone || "N/A", searchQuery)}</td>
                  <td>{highlightText(p.email || "N/A", searchQuery)}</td>
                  <td>{highlightText(p.identifierNumber || "N/A", searchQuery)}</td>
                  <td>{p.age ?? "N/A"}</td>
                  <td>{p.gender ?? "N/A"}</td>
                  <td className="text-right space-x-2">
                    <button className="btn btn-sm btn-outline btn-circle" onClick={() => handleView(p.patientId)} title="View">
                      <FaEye className="text-green-600" />
                    </button>
                    <button className="btn btn-sm btn-outline btn-circle" onClick={() => navigate(`/patients/${p.patientId}`)} title="Edit">
                      <FaEdit className="text-blue-600" />
                    </button>
                    <button className="btn btn-sm btn-outline btn-error btn-circle" onClick={() => handleDeleteClick(p.patientId)} title="Delete">
                      <FaTrashAlt />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination Controls */}
      <div className="flex justify-center mt-4 space-x-2">
        <button
          className="btn btn-xs"
          disabled={page === 0}
          onClick={() => setPage((p) => Math.max(0, p - 1))}
        >
          Previous
        </button>
        <span className="text-sm self-center">Page {page + 1} of {totalPages}</span>
        <button
          className="btn btn-xs"
          disabled={page + 1 >= totalPages}
          onClick={() => setPage((p) => p + 1)}
        >
          Next
        </button>
      </div>

      {showViewModal && selectedPatient && (
        <PatientViewModal patient={selectedPatient} onClose={() => setShowViewModal(false)} />
      )}

      <ConfirmDialog
        isOpen={isConfirmOpen}
        message={`Are you sure you want to delete ${fullName}?`}
        onConfirm={confirmDelete}
        onCancel={() => setIsConfirmOpen(false)}
      />
    </div>
  );
};

export default PatientListPage;
