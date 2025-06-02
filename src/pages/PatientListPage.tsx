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
import ManualRegistrationModal from "../components/patients/ManualRegistrationModal";
import ABHAVerificationSuccess from "../components/patients/ABHAVerificationSuccess";
import { usePatientFormStore } from "../store/patientFormStore";
import { mapAbhaProfileToPatient } from "../utils/mapAbhaToPatient";

const PatientListPage = () => {
  const [showManualRegistration, setShowManualRegistration] = useState(false);
  const [verifiedAbhaData, setVerifiedAbhaData] = useState(null);
  const [patients, setPatients] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [showViewModal, setShowViewModal] = useState(false);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [patientToDelete, setPatientToDelete] = useState(null);
  const [fullName, setFullName] = useState("");
  const [page, setPage] = useState(0);
  const [totalCount, setTotalCount] = useState(0);
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const pageSize = 10;
  
  const navigate = useNavigate();

    const { setQuickFormData } = usePatientFormStore();

  // Check if we should show the registration modal on component mount
  useEffect(() => {
    const shouldShowModal = sessionStorage.getItem('showRegistrationModal') === 'true';
    if (shouldShowModal) {
      setShowManualRegistration(true);
      // Clear the flag
      sessionStorage.removeItem('showRegistrationModal');
    }
  }, []);

  const handleABHAVerified = (abhaData) => {
    setVerifiedAbhaData(abhaData);
  };

  const handleABHACreated = (abhaData) => {
    setVerifiedAbhaData(abhaData);
  };

  const handleProceedToRegistration = (abhaData) => {
    // Map ABHA data to patient form data
    const patientData = mapAbhaProfileToPatient(abhaData);
    
    // Set the data in the store
    setQuickFormData(patientData);
    
    // Close modals
    setVerifiedAbhaData(null);
    setShowManualRegistration(false);
    
    // Navigate to patient registration form
    navigate("/patients");
  };

  const handleRegisterWithoutABHA = () => {
    setShowManualRegistration(false);
    navigate("/patients");
  };

  const debounce = (func, delay) => {
    let timeoutId;
    return (...args) => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => func(...args), delay);
    };
  };

  const fetchPatients = async (query, currentPage) => {
    try {
      setIsLoading(true);
      const result = await getPatientsPaginated({
        query,
        page: currentPage,
        size: pageSize,
      });
      
      setPatients(result.patients || []);
      setTotalCount(result.totalCount || 0);
    } catch (error) {
      console.error("Error fetching patients:", error);
      showError("Failed to load patients", "Please try again later");
    } finally {
      setIsLoading(false);
    }
  };

  const debouncedSearch = useRef(
    debounce((query) => {
      setPage(0);
      fetchPatients(query, 0);
    }, 400)
  ).current;

  const handleSearchInputChange = (e) => {
    const query = e.target.value;
    setSearchQuery(query);
    debouncedSearch(query);
  };

  const handleDeleteClick = (id) => {
    const patient = patients.find(p => p.patientId === id);
    if (patient) {
      const name = `${patient.firstName || ''} ${patient.middleName || ''} ${patient.lastName || ''}`.trim();
      setFullName(name);
      setPatientToDelete(patient);
      setIsConfirmOpen(true);
    }
  };

  const confirmDelete = async () => {
    if (!patientToDelete) return;
    
    try {
      const result = await deletePatientById(patientToDelete.upId || patientToDelete.patientId);
      if (result.success) {
        showSuccess("Patient Deleted", "Patient has been successfully deleted");
        setRefreshTrigger(prev => prev + 1);
      } else {
        showError("Delete Failed", result.error?.message || "Failed to delete patient");
      }
    } catch (error) {
      console.error("Error deleting patient:", error);
      showError("Delete Failed", "An error occurred while deleting the patient");
    } finally {
      setIsConfirmOpen(false);
      setPatientToDelete(null);
    }
  };

  const handleView = async (id) => {
    try {
      const result = await getPatientById(id);
      if (Array.isArray(result) && result.length > 0) {
        setSelectedPatient(result[0]);
        setShowViewModal(true);
      } else if (result && !Array.isArray(result)) {
        // Handle case where API returns a single object
        setSelectedPatient(result);
        setShowViewModal(true);
      } else {
        showError("Patient Not Found", "The requested patient could not be found");
      }
    } catch (error) {
      console.error("Error fetching patient details:", error);
      showError("Error", "Failed to fetch patient details");
    }
  };

  useEffect(() => {
    const handleRefreshEvent = () => setRefreshTrigger(prev => prev + 1);
    window.addEventListener("patient:registered", handleRefreshEvent);
    return () => window.removeEventListener("patient:registered", handleRefreshEvent);
  }, []);

  useEffect(() => {
    fetchPatients(searchQuery, page);
  }, [refreshTrigger, page]);

  const highlightText = (text, query) => {
    if (!query || !text) return text || "N/A";
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
      <div className="flex justify-between items-center">
        <h1 className="text-xl font-bold text-gray-800">Patient Management</h1>
        <div className="flex gap-2">
          <button
            className="btn btn-sm bg-primary text-white hover:bg-primary/90 shadow-md px-4 py-1.5 rounded-md"
            onClick={() => setShowManualRegistration(true)}
          >
            + Register Patient
          </button>
        </div>
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
            placeholder="Search by name, email, phone number, or identifier"
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
            {isLoading ? (
              <tr>
                <td colSpan={7} className="text-center py-4">
                  <div className="flex justify-center items-center">
                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
                    <span className="ml-2 text-gray-500">Loading patients...</span>
                  </div>
                </td>
              </tr>
            ) : patients.length === 0 ? (
              <tr>
                <td colSpan={7} className="text-center py-4 text-gray-500">
                  No patients found.
                </td>
              </tr>
            ) : (
              patients.map((p) => (
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

      {/* Pagination Controls */}
      {totalPages > 0 && (
        <div className="flex justify-center mt-4 space-x-2">
          <button
            className="btn btn-xs"
            disabled={page === 0 || isLoading}
            onClick={() => setPage((p) => Math.max(0, p - 1))}
          >
            Previous
          </button>
          <span className="text-sm self-center">Page {page + 1} of {totalPages}</span>
          <button
            className="btn btn-xs"
            disabled={page + 1 >= totalPages || isLoading}
            onClick={() => setPage((p) => p + 1)}
          >
            Next
          </button>
        </div>
      )}

      {showViewModal && selectedPatient && (
        <PatientViewModal patient={selectedPatient} onClose={() => setShowViewModal(false)} />
      )}

      <ConfirmDialog
        isOpen={isConfirmOpen}
        message={`Are you sure you want to delete ${fullName}?`}
        onConfirm={confirmDelete}
        onCancel={() => setIsConfirmOpen(false)}
      />

       {/* Manual Registration Modal */}
      {showManualRegistration && (
        <ManualRegistrationModal
          onClose={() => setShowManualRegistration(false)}
          onABHAVerified={handleABHAVerified}
          onABHACreated={handleABHACreated}
          onRegisterWithoutABHA={handleRegisterWithoutABHA}
        />
      )}

      {/* ABHA Verification Success Modal */}
      {verifiedAbhaData && (
        <ABHAVerificationSuccess
          abhaData={verifiedAbhaData}
          onClose={() => setVerifiedAbhaData(null)}
          onProceed={handleProceedToRegistration}
        />
      )}

    </div>
  );
};

export default PatientListPage;
