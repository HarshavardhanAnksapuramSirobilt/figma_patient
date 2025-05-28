import { useState } from "react";
import { useNavigate } from "react-router-dom";
import StepEnterAadhaar from "./StepEnterAadhaar";
import StepVerifyOtp from "./StepVerifyOtp";
import StepIndicator from "./StepIndicator";
import AbhaProfileCard from "./AbhaProfileCard";
import { mapAbhaProfileToPatient } from "../../../utils/mapAbhaToPatient";
import { usePatientFormStore } from "../../../store/patientFormStore";

export default function AbhaRegistrationForm() {
  const [step, setStep] = useState(0);
  const [txnId, setTxnId] = useState("");
  const [abhaData, setAbhaData] = useState<any>(null);
  const navigate = useNavigate();
const [aadhaar, setAadhaar] = useState(""); // <-- Add this

  return (
    <div className="max-w-xl mx-auto p-6 bg-white rounded-2xl shadow-xl space-y-6">
      <h1 className="text-2xl font-bold text-center text-gray-800">ABHA Registration</h1>

      <StepIndicator currentStep={step} />

  {step === 0 && (
  <StepEnterAadhaar
    onOtpSent={(txn) => {
      setTxnId(txn);
      setStep(1);
    }}
    onAadhaarChange={(aadhaarNumber) => setAadhaar(aadhaarNumber)} // <-- Add this
    onContinueToOtp={() => setStep(1)} // <-- Add this to support Continue button
  />
)}


   {step === 1 && (
  <StepVerifyOtp
    txnId={txnId}
    aadhaarNumber={aadhaar} // <-- Required for Resend OTP
    onOtpVerified={(responseData) => {
      console.log("ABHA Response:", responseData);
      const patientData = mapAbhaProfileToPatient(responseData.ABHAProfile);
      console.log("Mapped Patient Data:", patientData);
      usePatientFormStore.getState().setQuickFormData(patientData);
      setAbhaData(responseData);
      setStep(2);
    }}
    onResendOtp={(newTxnId) => setTxnId(newTxnId)} // <-- Add this
  />
)}


      {step === 2 && abhaData && (
        <>
          <AbhaProfileCard
            profile={abhaData.ABHAProfile}
            isNew={abhaData.isNew}
            message={
              abhaData.isNew
                ? "ABHA ID created successfully."
                : "You already have an ABHA account."
            }
          />
          <div className="text-center mt-4">
            <button
              className="btn btn-primary"
              onClick={() => navigate("/patients")}
            >
              Continue to Full Registration
            </button>
          </div>
        </>
      )}
    </div>
  );
}
