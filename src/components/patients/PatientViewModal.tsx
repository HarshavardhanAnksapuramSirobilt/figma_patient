import React from "react";

type Props = {
  patient: any;
  onClose: () => void;
};

const FieldRow = ({ label, value }: { label: string; value?: string | number }) => (
  <div className="flex text-sm py-1">
    <div className="w-1/3 text-gray-500 font-medium">{label}</div>
    <div className="w-2/3 text-gray-700">{value || "—"}</div>
  </div>
);

const PatientViewModal: React.FC<Props> = ({ patient, onClose }) => {
  if (!patient) return null;

  return (
    <div className="fixed inset-0 backdrop-blur-sm bg-white/30 flex justify-center items-center z-50">
      <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-xl max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold text-gray-800">Patient Details</h3>
          <button className="btn btn-sm btn-outline" onClick={onClose}>Close</button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-4 gap-y-2 text-sm">
          <FieldRow label="Name" value={`${patient.title || ""} ${patient.firstName} ${patient.lastName}`} />
          <FieldRow label="Gender" value={patient.gender} />
          <FieldRow label="Date of Birth" value={patient.dateOfBirth} />
          <FieldRow label="Age" value={patient.age} />
          <FieldRow label="Identifier Type" value={patient.identifierType} />
          <FieldRow label="Identifier Number" value={patient.identifierNumber} />

          <FieldRow label="Phone" value={patient.contacts?.[0]?.phoneNumber} />
          <FieldRow label="Email" value={patient.contacts?.[0]?.email} />

          <FieldRow label="Citizenship" value={patient.citizenship} />
          <FieldRow label="Religion" value={patient.religion} />
          <FieldRow label="Caste" value={patient.caste} />
          <FieldRow label="Occupation" value={patient.occupation} />
          <FieldRow label="Education" value={patient.education} />
          <FieldRow label="Annual Income" value={patient.annualIncome} />

          <FieldRow label="Emergency Contact Name" value={patient.emergencyContacts?.[0]?.contactName} />
          <FieldRow label="Emergency Phone" value={patient.emergencyContacts?.[0]?.phoneNumber} />
          <FieldRow label="Emergency Relationship" value={patient.emergencyContacts?.[0]?.relationship} />

          <FieldRow label="Insurance Provider" value={patient.insurance?.insuranceProvider} />
          <FieldRow label="Policy Number" value={patient.insurance?.policyNumber} />
          <FieldRow label="Coverage Amount" value={patient.insurance?.coverageAmount} />
        </div>
      </div>
    </div>
  );
};

export default PatientViewModal;
