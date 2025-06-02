import axios from "axios";
import type { OptionalPatientRegistrationPayload } from '../types/patient';

const BASE_URL = "https://megha-dev.sirobilt.com/api/";

// Create a new patient
export const createPatient = async (payload: OptionalPatientRegistrationPayload) => {
  try {
    console.log("Creating patient with payload:", payload);
    const response = await axios.post(`${BASE_URL}/patients`, payload);
    return { success: true, data: response.data };
  } catch (error: any) {
    console.error("API Error:", error.response?.data || error.message);
    return { success: false, error: error.response?.data || error.message };
  }
};

// Get patient by ID (upId)
export const getPatientById = async (id: string) => {
  try {
    const response = await axios.get(`${BASE_URL}/patients`, {
      params: { upId: id },
    });
    return response.data;
  } catch (error: any) {
    console.error("Fetch Error:", error);
    throw new Error("Failed to fetch patient data");
  }
};

// Update an existing patient
export const updatePatient = async (id: string, payload: OptionalPatientRegistrationPayload) => {
  try {
    const response = await axios.put(`${BASE_URL}/patients/${id}`, payload);
    return { success: true, data: response.data };
  } catch (error: any) {
    console.error("Update Error:", error);
    return { success: false, error: error.response?.data || error.message };
  }
};

// Get all patients
export const getAllPatients = async () => {
  try {
    const response = await axios.get(`${BASE_URL}/patients`);
    return response.data;
  } catch (error: any) {
    console.error("Failed to fetch patients:", error);
    return [];
  }
};

// Delete a patient by ID
export const deletePatientById = async (id: string) => {
  try {
    await axios.delete(`${BASE_URL}/patients/${id}`);
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.response?.data || error.message };
  }
};

// Search patients with filters
export const searchPatients = async (filters: Record<string, string>) => {
  const cleanedFilters: Record<string, string> = {};

  Object.entries(filters).forEach(([key, value]) => {
    const trimmed = value?.trim();
    if (trimmed) {
      cleanedFilters[key] = trimmed;
    }
  });

  try {
    const response = await axios.get(`${BASE_URL}/patients`, {
      params: cleanedFilters,
    });

    return response.data;
  } catch (error: any) {
    console.error("Search patients failed:", error);
    return [];
  }
};

// Get patients with pagination and search
export const getPatientsPaginated = async ({
  page,
  size,
  query,
}: {
  page: number;
  size: number;
  query: string;
}) => {
  try {
    const response = await axios.get(`${BASE_URL}/patients/query`, {
      params: {
        page,
        size,
        query: query || "",
      },
    });
    return response.data;
  } catch (error: any) {
    console.error("Paginated fetch error:", error.response?.data || error.message);
    throw new Error("Failed to fetch patients with pagination");
  }
};

// Get patient by ABHA number
export const getPatientByAbhaNumber = async (abhaNumber: string) => {
  try {
    const response = await axios.get(`${BASE_URL}/patients/abha/${abhaNumber}`);
    return { success: true, data: response.data };
  } catch (error: any) {
    console.error("ABHA Fetch Error:", error);
    return { success: false, error: error.response?.data || error.message };
  }
};

// Get patient by mobile number
export const getPatientByMobile = async (mobileNumber: string) => {
  try {
    const response = await axios.get(`${BASE_URL}/patients/mobile/${mobileNumber}`);
    return { success: true, data: response.data };
  } catch (error: any) {
    console.error("Mobile Fetch Error:", error);
    return { success: false, error: error.response?.data || error.message };
  }
};

// // Validate patient data before submission
// export const validatePatient = async (payload: OptionalPatientRegistrationPayload) => {
//   try {
//     const response = await axios.post(`${BASE_URL}/patients/validate`, payload);
//     return { success: true, data: response.data };
//   } catch (error: any) {
//     console.error("Validation Error:", error.response?.data || error.message);
//     return { success: false, error: error.response?.data || error.message };
//   }
// };

