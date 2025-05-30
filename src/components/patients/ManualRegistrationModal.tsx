import React, { useState } from "react";
import { Button } from "../../commonfields/Button";
import QRCodeScanner from "./QRCodeScanner";


type ManualRegistrationModalProps = {
  onClose: () => void;
  onABHAVerified: (abhaData: any) => void;
  onABHACreated: (abhaData: any) => void;
  onRegisterWithoutABHA?: () => void;
};

const ManualRegistrationModal: React.FC<ManualRegistrationModalProps> = ({
  onClose,
  onABHAVerified,
  onABHACreated,
  onRegisterWithoutABHA,
}) => {
  const [step, setStep] = useState<
    | "initial"
    | "hasABHA"
    | "createABHA"
    | "enterABHA"
    | "scanQR"
    | "enterAadhaar"
    | "enterDrivingLicense"
  >("initial");
  
  const [abhaNumber, setAbhaNumber] = useState("");
  const [aadhaarNumber, setAadhaarNumber] = useState("");
  const [drivingLicense, setDrivingLicense] = useState("");
  const [verificationMethod, setVerificationMethod] = useState<"otp" | "biometric">("otp");
  const [isVerifying, setIsVerifying] = useState(false);
  const [otp, setOtp] = useState("");
  const [error, setError] = useState("");

  {step === "scanQR" && (
  <div className="space-y-4">
    {isVerifying ? (
      <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 flex flex-col items-center justify-center bg-gray-50">
        <div className="w-48 h-48 bg-gray-200 rounded-lg flex items-center justify-center mb-4">
          <div className="animate-pulse text-gray-500">Scanning...</div>
        </div>
        <p className="text-sm text-gray-600 text-center">
          Processing QR code...
        </p>
      </div>
    ) : (
      <QRCodeScanner
        onScan={(data) => {
          setAbhaNumber(data);
          setIsVerifying(true);
          handleVerifyABHA();
        }}
        onError={(error) => {
          setError(`QR scanning error: ${error.message}`);
        }}
        onCancel={() => setStep("hasABHA")}
      />
    )}
    
    {!isVerifying && (
      <div className="pt-2">
        <button
          onClick={() => setStep("hasABHA")}
          className="text-indigo-600 hover:text-indigo-800 font-medium"
        >
          ← Back
        </button>
      </div>
    )}
  </div>
)}
  
  const handleVerifyABHA = async () => {
    setIsVerifying(true);
    setError("");
    
    try {
      // Mock API call to verify ABHA
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      if (abhaNumber.length !== 14) {
        throw new Error("Invalid ABHA number format");
      }
      
      // Mock successful verification
      const mockABHAData = {
        abhaNumber,
        name: "John Doe",
        gender: "M",
        yearOfBirth: "1990",
        monthOfBirth: "01",
        dayOfBirth: "15",
        address: "123 Main St, City",
        mobile: "9876543210",
        email: "john.doe@example.com"
      };
      
      onABHAVerified(mockABHAData);
    } catch (err) {
      setError(err.message || "Failed to verify ABHA number");
    } finally {
      setIsVerifying(false);
    }
  };
  
  const handleVerifyAadhaar = async () => {
    setIsVerifying(true);
    setError("");
    
    try {
      // Mock API call to verify Aadhaar
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      if (aadhaarNumber.length !== 12 || !/^\d+$/.test(aadhaarNumber)) {
        throw new Error("Invalid Aadhaar number format");
      }
      
      if (verificationMethod === "otp" && otp.length !== 6) {
        throw new Error("Invalid OTP");
      }
      
      // Mock successful ABHA creation
      const mockABHAData = {
        abhaNumber: "12345678901234",
        name: "John Doe",
        gender: "M",
        yearOfBirth: "1990",
        monthOfBirth: "01",
        dayOfBirth: "15",
        address: "123 Main St, City",
        mobile: "9876543210",
        email: "john.doe@example.com",
        isNewlyCreated: true
      };
      
      onABHACreated(mockABHAData);
    } catch (err) {
      setError(err.message || "Failed to verify Aadhaar");
    } finally {
      setIsVerifying(false);
    }
  };
  
  const handleVerifyDrivingLicense = async () => {
    setIsVerifying(true);
    setError("");
    
    try {
      // Mock API call to verify Driving License
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      if (drivingLicense.length < 8) {
        throw new Error("Invalid Driving License format");
      }
      
      // Mock successful ABHA creation
      const mockABHAData = {
        abhaNumber: "98765432109876",
        name: "Jane Smith",
        gender: "F",
        yearOfBirth: "1992",
        monthOfBirth: "05",
        dayOfBirth: "20",
        address: "456 Oak St, Town",
        mobile: "9876543210",
        email: "jane.smith@example.com",
        isNewlyCreated: true
      };
      
      onABHACreated(mockABHAData);
    } catch (err) {
      setError(err.message || "Failed to verify Driving License");
    } finally {
      setIsVerifying(false);
    }
  };
  
  const handleScanQR = () => {
    // Mock QR scanning
    setTimeout(() => {
      setAbhaNumber("98765432101234");
      handleVerifyABHA();
    }, 2000);
  };
  
  const handleRegisterWithoutABHA = () => {
    if (onRegisterWithoutABHA) {
      onRegisterWithoutABHA();
    } else {
      onClose();
    }
  };
  
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-gray-800">
            {step === "initial" && "Patient Registration Options"}
            {step === "hasABHA" && "Verify ABHA"}
            {step === "createABHA" && "Create ABHA"}
            {step === "enterABHA" && "Enter ABHA Number"}
            {step === "scanQR" && "Scan ABHA QR Code"}
            {step === "enterAadhaar" && "Enter Aadhaar Number"}
            {step === "enterDrivingLicense" && "Enter Driving License"}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>
        
        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded text-red-700 text-sm">
            {error}
          </div>
        )}
        
        {step === "initial" && (
          <div className="space-y-4">
            <p className="text-gray-600 mb-4">
              Please select an option to proceed with patient registration:
            </p>
            <button
              onClick={() => setStep("hasABHA")}
              className="w-full p-4 bg-white border border-gray-300 rounded-lg shadow-sm hover:bg-gray-50 transition flex items-center justify-between"
            >
              <span className="font-medium">Register with existing ABHA</span>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 text-gray-400"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                  clipRule="evenodd"
                />
              </svg>
            </button>
            <button
              onClick={() => setStep("createABHA")}
              className="w-full p-4 bg-white border border-gray-300 rounded-lg shadow-sm hover:bg-gray-50 transition flex items-center justify-between"
            >
              <span className="font-medium">Create new ABHA</span>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 text-gray-400"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                  clipRule="evenodd"
                />
              </svg>
            </button>
            <button
              onClick={handleRegisterWithoutABHA}
              className="w-full p-4 bg-white border border-gray-300 rounded-lg shadow-sm hover:bg-gray-50 transition flex items-center justify-between"
            >
              <span className="font-medium">Register without ABHA</span>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 text-gray-400"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                  clipRule="evenodd"
                />
              </svg>
            </button>
          </div>
        )}
        
        {step === "hasABHA" && (
          <div className="space-y-4">
            <p className="text-gray-600 mb-4">
              Please select how you want to verify the ABHA:
            </p>
            <button
              onClick={() => setStep("enterABHA")}
              className="w-full p-4 bg-white border border-gray-300 rounded-lg shadow-sm hover:bg-gray-50 transition flex items-center justify-between"
            >
              <span className="font-medium">Enter ABHA Number</span>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 text-gray-400"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                  clipRule="evenodd"
                />
              </svg>
            </button>
            <button
              onClick={() => setStep("scanQR")}
              className="w-full p-4 bg-white border border-gray-300 rounded-lg shadow-sm hover:bg-gray-50 transition flex items-center justify-between"
            >
              <span className="font-medium">Scan QR Code for ABHA</span>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 text-gray-400"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                  clipRule="evenodd"
                />
              </svg>
            </button>
            <div className="pt-2">
              <button
                onClick={() => setStep("initial")}
                className="text-indigo-600 hover:text-indigo-800 font-medium"
              >
                ← Back
              </button>
            </div>
          </div>
        )}
        
        {step === "createABHA" && (
          <div className="space-y-4">
            <p className="text-gray-600 mb-4">
              Please select a method to create ABHA:
            </p>
            <button
              onClick={() => setStep("enterAadhaar")}
              className="w-full p-4 bg-white border border-gray-300 rounded-lg shadow-sm hover:bg-gray-50 transition flex items-center justify-between"
            >
              <span className="font-medium">Enter Aadhaar Number</span>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 text-gray-400"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                  clipRule="evenodd"
                />
              </svg>
            </button>
            <button
              onClick={() => setStep("enterDrivingLicense")}
              className="w-full p-4 bg-white border border-gray-300 rounded-lg shadow-sm hover:bg-gray-50 transition flex items-center justify-between"
            >
              <span className="font-medium">Enter Driving License Number</span>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 text-gray-400"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                  clipRule="evenodd"
                />
              </svg>
            </button>
            <div className="pt-2">
              <button
                onClick={() => setStep("initial")}
                className="text-indigo-600 hover:text-indigo-800 font-medium"
              >
                ← Back
              </button>
            </div>
          </div>
        )}
        
        {step === "enterABHA" && (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                ABHA Number
              </label>
              <input
                type="text"
                value={abhaNumber}
                onChange={(e) => setAbhaNumber(e.target.value)}
                placeholder="Enter 14-digit ABHA number"
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                maxLength={14}
              />
              <p className="mt-1 text-sm text-gray-500">
                Format: 14 digits (e.g., 12345678901234)
              </p>
            </div>
            
            <div className="flex space-x-3 pt-2">
              <Button
                onClick={handleVerifyABHA}
                disabled={isVerifying || abhaNumber.length !== 14}
                variant="primary"
              >
                {isVerifying ? "Verifying..." : "Verify ABHA"}
              </Button>
              <Button
                onClick={() => setStep("hasABHA")}
                variant="outline"
              >
                Back
              </Button>
            </div>
          </div>
        )}
        
        {step === "scanQR" && (
          <div className="space-y-4">
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 flex flex-col items-center justify-center bg-gray-50">
              <div className="w-48 h-48 bg-gray-200 rounded-lg flex items-center justify-center mb-4">
                {isVerifying ? (
                  <div className="animate-pulse text-gray-500">Scanning...</div>
                ) : (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-16 w-16 text-gray-400"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm12 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z"
                    />
                  </svg>
                )}
              </div>
              <p className="text-sm text-gray-600 text-center">
                Position the QR code within the scanner area
              </p>
            </div>
            
            <div className="flex space-x-3 pt-2">
              <Button
                onClick={handleScanQR}
                disabled={isVerifying}
                variant="primary"
              >
                {isVerifying ? "Scanning..." : "Start Scanning"}
              </Button>
              <Button
                onClick={() => setStep("hasABHA")}
                variant="outline"
              >
                Back
              </Button>
            </div>
          </div>
        )}
        
        {step === "enterAadhaar" && (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Aadhaar Number
              </label>
              <input
                type="text"
                value={aadhaarNumber}
                onChange={(e) => {
                  const value = e.target.value.replace(/\D/g, "");
                  setAadhaarNumber(value);
                }}
                placeholder="Enter 12-digit Aadhaar number"
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                maxLength={12}
              />
              <p className="mt-1 text-sm text-gray-500">
                Format: 12 digits (e.g., 123456789012)
              </p>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Verification Method
              </label>
              <div className="flex space-x-4">
                <label className="inline-flex items-center">
                  <input
                    type="radio"
                    className="form-radio text-indigo-600"
                    name="verificationMethod"
                    checked={verificationMethod === "otp"}
                    onChange={() => setVerificationMethod("otp")}
                  />
                  <span className="ml-2">OTP</span>
                </label>
                <label className="inline-flex items-center">
                  <input
                    type="radio"
                    className="form-radio text-indigo-600"
                    name="verificationMethod"
                    checked={verificationMethod === "biometric"}
                    onChange={() => setVerificationMethod("biometric")}
                  />
                  <span className="ml-2">Biometric</span>
                </label>
              </div>
            </div>
            
            {verificationMethod === "otp" && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  OTP
                </label>
                <div className="flex space-x-2">
                  <input
                    type="text"
                    value={otp}
                    onChange={(e) => {
                      const value = e.target.value.replace(/\D/g, "");
                      setOtp(value);
                    }}
                    placeholder="Enter 6-digit OTP"
                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                    maxLength={6}
                  />
                  <button
                    className="px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200"
                    onClick={() => alert("OTP sent to registered mobile")}
                  >
                    Send OTP
                  </button>
                </div>
              </div>
            )}
            
            {verificationMethod === "biometric" && (
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 flex flex-col items-center justify-center bg-gray-50">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-12 w-12 text-gray-400 mb-2"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 11c0 3.517-1.009 6.799-2.753 9.571m-3.44-2.04l.054-.09A13.916 13.916 0 008 11a4 4 0 118 0c0 1.017-.07 2.019-.203 3m-2.118 6.844A21.88 21.88 0 0015.171 17m3.839 1.132c.645-2.266.99-4.659.99-7.132A8 8 0 008 4.07M3 15.364c.64-1.319 1-2.8 1-4.364 0-1.457.39-2.823 1.07-4"
                  />
                </svg>
                <p className="text-sm text-gray-600 text-center">
                  Connect biometric device and scan fingerprint
                </p>
                <button
                  className="mt-2 px-4 py-2 bg-indigo-100 text-indigo-700 rounded-md hover:bg-indigo-200"
                  onClick={() => alert("Biometric scan initiated")}
                >
                  Start Scan
                </button>
              </div>
            )}
            
            <div className="flex space-x-3 pt-2">
              <Button
                onClick={handleVerifyAadhaar}
                disabled={isVerifying || aadhaarNumber.length !== 12 || (verificationMethod === "otp" && otp.length !== 6)}
                variant="primary"
              >
                {isVerifying ? "Verifying..." : "Verify & Create ABHA"}
              </Button>
              <Button
                onClick={() => setStep("createABHA")}
                variant="outline"
              >
                Back
              </Button>
            </div>
          </div>
        )}
        
        {step === "enterDrivingLicense" && (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Driving License Number
              </label>
              <input
                type="text"
                value={drivingLicense}
                onChange={(e) => setDrivingLicense(e.target.value)}
                placeholder="Enter Driving License number"
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
              />
              <p className="mt-1 text-sm text-gray-500">
                Format: As printed on your Driving License
              </p>
            </div>
            
            <div className="flex space-x-3 pt-2">
              <Button
                onClick={handleVerifyDrivingLicense}
                disabled={isVerifying || drivingLicense.length < 8}
                variant="primary"
              >
                {isVerifying ? "Verifying..." : "Verify & Create ABHA"}
              </Button>
              <Button
                onClick={() => setStep("createABHA")}
                variant="outline"
              >
                Back
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ManualRegistrationModal;



