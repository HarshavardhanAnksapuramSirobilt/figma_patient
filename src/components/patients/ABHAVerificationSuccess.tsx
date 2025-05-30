import React from "react";
import { Button } from "../../commonfields/Button";

type ABHAVerificationSuccessProps = {
  abhaData: any;
  onClose: () => void;
  onProceed: (abhaData: any) => void;
};

const ABHAVerificationSuccess: React.FC<ABHAVerificationSuccessProps> = ({
  abhaData,
  onClose,
  onProceed,
}) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-gray-800">
            {abhaData.isNewlyCreated ? "ABHA Created Successfully" : "ABHA Verified Successfully"}
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
        
        <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-4">
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
              {abhaData.isNewlyCreated
                ? "ABHA has been created successfully"
                : "ABHA has been verified successfully"}
            </span>
          </div>
        </div>
        
        <div className="bg-gray-50 rounded-lg p-4 mb-4">
          <h3 className="text-lg font-medium text-gray-800 mb-2">ABHA Details</h3>
          <div className="grid grid-cols-2 gap-2">
            <div className="text-sm text-gray-500">ABHA Number:</div>
            <div className="text-sm font-medium">{abhaData.abhaNumber}</div>
            
            <div className="text-sm text-gray-500">Name:</div>
            <div className="text-sm font-medium">{abhaData.name}</div>
            
            <div className="text-sm text-gray-500">Gender:</div>
            <div className="text-sm font-medium">
              {abhaData.gender === "M" ? "Male" : abhaData.gender === "F" ? "Female" : "Other"}
            </div>
            
            <div className="text-sm text-gray-500">Date of Birth:</div>
            <div className="text-sm font-medium">
              {`${abhaData.dayOfBirth || "DD"}-${abhaData.monthOfBirth || "MM"}-${abhaData.yearOfBirth || "YYYY"}`}
            </div>
            
            <div className="text-sm text-gray-500">Mobile:</div>
            <div className="text-sm font-medium">{abhaData.mobile}</div>
            
            {abhaData.email && (
              <>
                <div className="text-sm text-gray-500">Email:</div>
                <div className="text-sm font-medium">{abhaData.email}</div>
              </>
            )}
          </div>
        </div>
        
        <div className="flex justify-end space-x-3">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button variant="primary" onClick={() => onProceed(abhaData)}>
            Proceed to Registration
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ABHAVerificationSuccess;