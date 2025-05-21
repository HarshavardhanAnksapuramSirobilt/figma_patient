import axios from "axios";
import type{ OptionalPatientRegistrationPayload } from '../types/patient';

const BASE_URL = import.meta.env.VITE_API_BASE_URL;


export const createPatient = async (payload: OptionalPatientRegistrationPayload) => {
  try {
    const facilityId="5f7031cd-9c93-BF2b-B5cD-4cb1bD59D8B9"
    const updatedPayload={...payload,facilityId}
    const response = await axios.post(`${BASE_URL}/patients`, updatedPayload);
    return { success: true, data: response.data };
  } catch (error: any) {
    console.error("API Error:", error.response?.data || error.message);
    return { success: false, error: error.response?.data || error.message };
  }
};

export const getPatientById = async (id: string) => {
  try {
    const response = await axios.get(`${BASE_URL}/patients`, {
      params: { id },
    });
    return response.data;
  } catch (error: any) {
    console.error("Fetch Error:", error);
    throw new Error("Failed to fetch patient data");
  }
};

export const updatePatient = async (id: string, payload: OptionalPatientRegistrationPayload) => {
  try {
    const response = await axios.put(`${BASE_URL}/patients/${id}`, payload);
    return { success: true, data: response.data };
  } catch (error: any) {
    console.error("Update Error:", error);
    return { success: false, error: error.response?.data || error.message };
  }
};

export const getAllPatients = async () => {
  try {
    const res = await axios.get(`${BASE_URL}/api/patients`);
    return res.data;
  } catch (err: any) {
    console.error("Failed to fetch patients:", err);
    return [];
  }
};

export const deletePatient = async (id: string) => {
  try {
    await axios.delete(`${BASE_URL}/${id}`);
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.response?.data || error.message };
  }
};


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
  } catch (err) {
    console.error("Search patients failed:", err);
    return [];
  }
};


export const deletePatientById = async (id: string) => {
  try {
    await axios.delete(`${BASE_URL}/patients/${id}`);
    return true;
  } catch (err) {
    console.error("Delete failed:", err);
    return false;
  }
};







