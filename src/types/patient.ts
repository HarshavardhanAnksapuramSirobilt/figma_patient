import {
  ContactMode, PhonePref, AddressType, BillingType, RelationType,
  IdentifierType, Title, Gender, BloodGroup, MaritalStatus
} from "./patientenums";

// --- Child Types ---
export interface Contact {
  mobileNumber?: string | null;
  phoneNumber?: string | null;
  email?: string | null;
  preferredContactMode?: ContactMode | null;
  phoneContactPreference?: PhonePref | null;
  consentToShare?: boolean;
}

export interface Address {
  addressType?: AddressType;
  houseNoOrFlatNo?: string | null;
  localityOrSector?: string | null;
  cityOrVillage?: string | null;
  pincode?: string | null;
  districtId?: string | null;
  stateId?: string | null;
  country?: string; // default = "India"
}

export interface Abha {
  abhaNumber?: string | null;
  abhaAddress?: string | null;
}

export interface BillingReferral {
  billingType?: BillingType;
  referredBy?: string | null;
}

export interface EmergencyContact {
  contactName?: string | null;
  relationship?: RelationType | null;
  phoneNumber?: string | null;
}

export interface InformationSharing {
  shareWithSpouse?: boolean;
  shareWithChildren?: boolean;
  shareWithCaregiver?: boolean;
  shareWithOther?: boolean;
}

export interface Insurance {
  insuranceProvider?: string | null;
  policyNumber?: string | null;
  policyStartDate?: string | null;
  policyEndDate?: string | null;
  coverageAmount?: number;
}

export interface Referral {
  fromFacilityId?: string | null;
  toFacilityId?: string | null;
  referralDate?: string | null;
  reason?: string | null;
}

export interface Relationship {
  relativeId?: string | null;
  relationshipType?: RelationType | null;
}

export interface Token {
  tokenNumber?: string | null;
  issueDate?: string | null;
  expiryDate?: string | null;
  status?: "Active" | "Pending" | "Expired";
  isRegistered?: boolean;
  allocatedTo?: string | null;
}

// --- Main Patient DTO Type ---
export interface PatientRegistrationPayload {
  patientId?: string;
  facilityId?: string;
  identifierType?: IdentifierType;
  identifierNumber?: string;

  title?: Title | null;
  firstName?: string | null;
  middleName?: string | null;
  lastName?: string | null;
  dateOfBirth?: string | null;
  age?: number | null;
  gender?: Gender | null;
  bloodGroup?: BloodGroup | null;
  maritalStatus?: MaritalStatus | null;
  citizenship?: string | null;
  religion?: string | null;
  caste?: string | null;
  occupation?: string | null;
  education?: string | null;
  annualIncome?: string | null;

  contacts?: Contact[];
  addresses?: Address[];
  abha?: Abha;
  billingReferral?: BillingReferral;
  emergencyContacts?: EmergencyContact[];
  informationSharing?: InformationSharing;
  insurance?: Insurance;
  referrals?: Referral[];
  relationships?: Relationship[];
  tokens?: Token[];

}

export type OptionalPatientRegistrationPayload = Partial<PatientRegistrationPayload>;

export const defaultPatientRegistrationPayload: PatientRegistrationPayload = {
  identifierType: null,
  identifierNumber: "",

  title: null,
  firstName: null,
  middleName: null,
  lastName: null,
  dateOfBirth: null,
  age: null,
  gender: null,
  bloodGroup: null,
  maritalStatus: null,
  citizenship: null,
  religion: null,
  caste: null,
  occupation: null,
  education: null,
  annualIncome: null,

  contacts: [
    {
      mobileNumber: null,
      phoneNumber: null,
      email: null,
      preferredContactMode: null,
      phoneContactPreference: null,
      consentToShare: false,
    },
  ],
  addresses: [
    {
      addressType: AddressType.Permanent,
      houseNoOrFlatNo: null,
      localityOrSector: null,
      cityOrVillage: null,
      pincode: null,
      districtId: null,
      stateId: null,
      country: null,
    },
  ],
  abha: {
    abhaNumber: null,
    abhaAddress: null,
  },
  billingReferral: {
    billingType: BillingType.General,
    referredBy: null,
  },
  emergencyContacts: [
    {
      contactName: null,
      relationship: null,
      phoneNumber: null,
    },
  ],
  informationSharing: {
    shareWithSpouse: false,
    shareWithChildren: false,
    shareWithCaregiver: false,
    shareWithOther: false,
  },
  insurance: {
    insuranceProvider: null,
    policyNumber: null,
    policyStartDate: null,
    policyEndDate: null,
    coverageAmount: 0,
  },
  referrals: [],
  relationships: [],
  tokens: [],
};

