import {AddressType, IdentifierType, Gender } from "../types/patientenums";
import type{ PatientRegistrationPayload } from "../types/patient";

export function mapAbhaProfileToPatient(abhaProfile: any): Partial<PatientRegistrationPayload> {
  return {
    identifierType: IdentifierType.ABHA,
    identifierNumber: abhaProfile.ABHANumber,

    firstName: abhaProfile.firstName || null,
    middleName: abhaProfile.middleName || null,
    lastName: abhaProfile.lastName || null,
    dateOfBirth: abhaProfile.dob || null,
    gender: abhaProfile.gender === "M" ? Gender.Male : abhaProfile.gender === "F" ? Gender.Female : Gender.Other,

    contacts: [
      {
        phoneNumber: abhaProfile.mobile || null,
        email: abhaProfile.email || null,
      },
    ],

    addresses: [
      {
        addressType: AddressType.Permanent,
        houseNoOrFlatNo: abhaProfile.address || null,
        districtId: abhaProfile.districtName || null,
        stateId: abhaProfile.stateName || null,
        // cityOrVillage: abhaProfile.districtName || null,
        pincode: abhaProfile.pinCode || null,
        country: "India",
      },
    ],

    abha: {
      abhaNumber: abhaProfile.ABHANumber || null,
      abhaAddress: abhaProfile.phrAddress?.[0] || null,
    },
  };
}
