import React, { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { searchPatients, deletePatientById, getPatientById } from "../services/patientApis";
import { FaEdit, FaTrashAlt, FaEye } from "react-icons/fa";
import PatientViewModal from "../components/patients/PatientViewModal";

// Debounce utility
const debounce = (func: (...args: any[]) => void, delay: number) => {
    let timeoutId: ReturnType<typeof setTimeout>;
    return (...args: any[]) => {
        clearTimeout(timeoutId);
        timeoutId = setTimeout(() => func(...args), delay);
    };
};

const PatientListPage = () => {
    const [patients, setPatients] = useState([]);
    const [selectedPatient, setSelectedPatient] = useState<any>(null);
    const [showViewModal, setShowViewModal] = useState(false);

    const [filters, setFilters] = useState({
        firstName: "",
        lastName: "",
        email: "",
        mobile: "",
        city: "",
    });

    const navigate = useNavigate();

    const debouncedSearch = useRef(
        debounce((updatedFilters: typeof filters) => {
            searchPatients(updatedFilters).then(setPatients);
        }, 400)
    ).current;

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const updated = { ...filters, [e.target.name]: e.target.value };
        setFilters(updated);
        debouncedSearch(updated);
    };

    const handleDelete = async (id: string) => {
        const confirm = window.confirm("Are you sure you want to delete this patient?");
        if (confirm) {
            const success = await deletePatientById(id);
            if (success) {
                alert("Deleted successfully");
                searchPatients(filters).then(setPatients);
            } else {
                alert("Failed to delete");
            }
        }
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
            console.log(error)
            alert("Error fetching patient details.");
        }
    };

    useEffect(() => {
        searchPatients(filters).then(setPatients); // initial load
    }, []);

    return (
        <div className="flex flex-col gap-6 w-full p-6">
            <div className="flex justify-end">
                <button
                    className="btn btn-sm bg-primary text-black hover:bg-primary/90 shadow-md px-4 py-1.5 rounded-md"
                    onClick={() => navigate("/patients")}
                >
                    Register Patient
                </button>
            </div>

            {/* Search Filter Layout */}
            <div className="bg-white p-4 border border-gray-200 rounded-md shadow-sm space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3 w-full text-sm">
                    {["firstName", "lastName", "email", "mobile", "city"].map((key) => (
                        <input
                            key={key}
                            name={key}
                            value={filters[key as keyof typeof filters]}
                            onChange={handleInputChange}
                            placeholder={key.replace(/([A-Z])/g, " $1").replace(/^./, str => str.toUpperCase())}
                            className="input input-bordered input-sm w-full text-sm"
                        />
                    ))}
                </div>
            </div>

            {/* Patient Table */}
            <div className="overflow-x-auto shadow rounded-lg border border-gray-200">
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
                                    <td className="font-medium text-gray-800">{p.firstName} {p.lastName}</td>
                                    <td>{p.phone || "—"}</td>
                                    <td>{p.email || "—"}</td>
                                    <td>{p.identifierNumber || "—"}</td>
                                    <td>{p.age ?? "—"}</td>
                                    <td>{p.gender ?? "—"}</td>
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
                                            onClick={() => handleDelete(p.patientId)}
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

        </div>

    );
};

export default PatientListPage;
