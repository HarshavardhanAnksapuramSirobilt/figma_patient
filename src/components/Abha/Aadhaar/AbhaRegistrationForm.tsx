import { useState } from "react";
import StepEnterAadhaar from "./StepEnterAadhaar";
import StepVerifyOtp from "./StepVerifyOtp";
import StepIndicator from "./StepIndicator";
import AbhaProfileCard from "./AbhaProfileCard";

export default function AbhaRegistrationForm() {
  const [step, setStep] = useState(0);
  const [txnId, setTxnId] = useState("");
  const [abhaData, setAbhaData] = useState<any>(null);

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
        />
      )}

      {step === 1 && (
        <StepVerifyOtp
          txnId={txnId}
          onOtpVerified={(responseData) => {
            setAbhaData(responseData);
            setStep(2);
          }}
        />
      )}

      {step === 2 && abhaData && (
        <AbhaProfileCard
          profile={abhaData.ABHAProfile}
          isNew={abhaData.isNew}
          message={
            abhaData.isNew
              ? "ABHA ID created successfully."
              : "You already have an ABHA account."
          }
        />
      )}
    </div>
  );
}
