import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { usePatientFormStore } from "../store/patientFormStore";
import { PatientRegistrationForm } from "../components/patients/PatientRegistrationForm";

const PatientPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { quickFormData, clearQuickFormData } = usePatientFormStore();
  const [isNewPatient, setIsNewPatient] = useState(!id);
  const [isABHAVerified, setIsABHAVerified] = useState(false);

  useEffect(() => {
    // Check if we have ABHA data
    if (quickFormData && quickFormData.abha && quickFormData.abha.abhaNumber) {
      setIsABHAVerified(true);
    }

    // For debugging
    console.log("QuickFormData in PatientPage:", quickFormData);

    // Clean up function
    return () => {
      // Clear the quick form data when component unmounts
      clearQuickFormData();
    };
  }, [quickFormData, clearQuickFormData]);

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">
          {isNewPatient ? "New Patient Registration" : "Edit Patient"}
        </h1>
        <button
          onClick={() => navigate("/list")}
          className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300"
        >
          Back to Patient List
        </button>
      </div>

      {isABHAVerified && (
        <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg">
          <div className="flex items-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6 text-green-500 mr-2"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 13l4 4L19 7"
              />
            </svg>
            <span className="text-green-700 font-medium">
              ABHA Verified: {quickFormData?.abha?.abhaNumber}
            </span>
          </div>
          <p className="text-sm text-gray-600 mt-1 ml-8">
            Patient information has been pre-filled from ABHA data. Please review and complete the registration.
          </p>
        </div>
      )}

      <div className="bg-white rounded-lg shadow">
        <PatientRegistrationForm
          patientId={id}
          initialData={quickFormData || undefined}
          onSuccess={() => navigate("/list")}
        />
      </div>
    </div>
  );
};

export default PatientPage;
