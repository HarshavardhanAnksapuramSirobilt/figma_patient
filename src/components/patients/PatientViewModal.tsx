import React from "react";
import { X } from "lucide-react";

type Props = {
  patient: any;
  onClose: () => void;
};

const FieldRow = ({ label, value }: { label: string; value?: string | number | boolean }) => (
  <div className="text-sm space-x-1">
    <span className="font-semibold text-gray-600">{label}:</span>
    <span className="text-gray-800 break-words">{value !== null && value !== undefined && value !== "" ? String(value) : "N/A"}</span>
  </div>
);

const Section = ({ title, children }: { title: string; children: React.ReactNode }) => (
  <div className="mt-6 bg-gray-50 border border-gray-200 rounded-xl p-4 shadow-sm">
    <h4 className="text-md font-bold text-gray-700 mb-4 border-b pb-2">{title}</h4>
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">{children}</div>
  </div>
);

const PatientViewModal: React.FC<Props> = ({ patient, onClose }) => {
  if (!patient) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/30 backdrop-blur-sm flex justify-center items-center px-4 py-8 overflow-y-auto">
      <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-6xl border border-gray-200 relative max-h-[95vh] overflow-y-auto">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-600 hover:text-red-500 transition-colors"
          aria-label="Close"
        >
          <X size={24} />
        </button>

        {/* Header */}
        <div className="mb-8 text-center">
          <h3 className="text-2xl font-bold text-gray-800">Patient Overview</h3>
          <p className="text-sm text-gray-500">Comprehensive details of the selected patient</p>
        </div>

        {/* Sections */}
        <Section title="Basic Information">
        
          <FieldRow label="Full Name" value={patient.fullName} />
          <FieldRow label="Title" value={patient.title} />
          <FieldRow label="First Name" value={patient.firstName} />
          <FieldRow label="Middle Name" value={patient.middleName} />
          <FieldRow label="Last Name" value={patient.lastName} />
          <FieldRow label="Gender" value={patient.gender} />
          <FieldRow label="Date of Birth" value={patient.dateOfBirth} />
          <FieldRow label="Age" value={patient.age} />
          <FieldRow label="Marital Status" value={patient.maritalStatus} />
          <FieldRow label="Occupation" value={patient.occupation} />
          <FieldRow label="Education" value={patient.education} />
          <FieldRow label="Religion" value={patient.religion} />
          <FieldRow label="Caste" value={patient.caste} />
          <FieldRow label="Citizenship" value={patient.citizenship} />
          <FieldRow label="Annual Income" value={patient.annualIncome} />
          <FieldRow label="Blood Group" value={patient.bloodGroup} />
          <FieldRow label="Registration Date" value={patient.registrationDate} />
          <FieldRow label="Active" value={patient.isActive ? "Yes" : "No"} />
          <FieldRow label="Deceased" value={patient.isDeceased ? "Yes" : "No"} />
        </Section>

        <Section title="Identification">
          <FieldRow label="Identifier Type" value={patient.identifierType} />
          <FieldRow label="Identifier Number" value={patient.identifierNumber} />
          <FieldRow label="Facility ID" value={patient.facilityId} />
        </Section>

        <Section title="Contacts">
          <FieldRow label="Primary Phone" value={patient.phone} />
          <FieldRow label="Primary Email" value={patient.email} />
          {patient.contacts?.map((contact: any, idx: number) => (
            <React.Fragment key={idx}>
              <FieldRow label={`Contact ${idx + 1} Name`} value={contact.contactName} />
              <FieldRow label={`Contact ${idx + 1} Phone`} value={contact.phoneNumber} />
              <FieldRow label={`Contact ${idx + 1} Email`} value={contact.email} />
              <FieldRow label={`Contact ${idx + 1} Relationship`} value={contact.relationship} />
            </React.Fragment>
          ))}
        </Section>

        <Section title="Emergency Contacts">
          {patient.emergencyContacts?.map((ec: any, idx: number) => (
            <React.Fragment key={idx}>
              <FieldRow label="Name" value={ec.contactName} />
              <FieldRow label="Phone" value={ec.phoneNumber} />
              <FieldRow label="Relationship" value={ec.relationship} />
            </React.Fragment>
          ))}
        </Section>

        <Section title="Insurance Details">
          <FieldRow label="Provider" value={patient.insurance?.insuranceProvider} />
          <FieldRow label="Policy Number" value={patient.insurance?.policyNumber} />
          <FieldRow label="Start Date" value={patient.insurance?.policyStartDate} />
          <FieldRow label="End Date" value={patient.insurance?.policyEndDate} />
          <FieldRow label="Coverage Amount" value={patient.insurance?.coverageAmount} />
        </Section>

        <Section title="Addresses">
          {patient.addresses?.length > 0 ? (
            patient.addresses.map((addr: any, idx: number) => (
              <React.Fragment key={idx}>
                <FieldRow label={`Address ${idx + 1} - Type`} value={addr.addressType} />
                <FieldRow label={`Address ${idx + 1} - House / Flat No.`} value={addr.houseNoOrFlatNo} />
                <FieldRow label={`Address ${idx + 1} - Locality / Sector`} value={addr.localityOrSector} />
                <FieldRow label={`Address ${idx + 1} - City / Village`} value={addr.cityOrVillage} />
                <FieldRow label={`Address ${idx + 1} - District`} value={addr.districtId} />
                <FieldRow label={`Address ${idx + 1} - State`} value={addr.stateId} />
                <FieldRow label={`Address ${idx + 1} - Country`} value={addr.country} />
                <FieldRow label={`Address ${idx + 1} - Pincode`} value={addr.pincode} />
                {idx < patient.addresses.length - 1 && (
                  <div className="col-span-full border-t border-gray-200 my-2"></div>
                )}
              </React.Fragment>
            ))
          ) : (
            <FieldRow label="Addresses" value="None" />
          )}
        </Section>

        <Section title="Referrals & Billing">
          <FieldRow label="Billing Type" value={patient.billingReferral?.billingType} />
          <FieldRow label="Referred By" value={patient.billingReferral?.referredBy} />
        </Section>

        <Section title="Information Sharing">
          <FieldRow label="With Spouse" value={patient.informationSharing?.shareWithSpouse ? "Yes" : "No"} />
          <FieldRow label="With Children" value={patient.informationSharing?.shareWithChildren ? "Yes" : "No"} />
          <FieldRow label="With Caregiver" value={patient.informationSharing?.shareWithCaregiver ? "Yes" : "No"} />
          <FieldRow label="With Other" value={patient.informationSharing?.shareWithOther ? "Yes" : "No"} />
        </Section>

        <Section title="Relationships">
          {patient.relationships?.length > 0 ? (
            patient.relationships.map((r: any, idx: number) => (
              <FieldRow key={idx} label={`Relationship ${idx + 1}`} value={JSON.stringify(r)} />
            ))
          ) : (
            <FieldRow label="Relationships" value="None" />
          )}
        </Section>

        {/* Mobile close button */}
        <div className="text-right mt-8 sm:hidden">
          <button className="bg-gray-100 hover:bg-gray-200 text-sm px-4 py-2 rounded shadow" onClick={onClose}>
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default PatientViewModal;
