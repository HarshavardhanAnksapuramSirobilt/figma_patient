import axios from "axios";

const BASE_URL = import.meta.env.VITE_API_BASE_URL;

export const getAppointments = async (providerId, startDate, endDate) => {
  try {
    const params = { providerId };
    if (startDate) params.startDate = startDate;
    if (endDate) params.endDate = endDate;
    
    const response = await axios.get(`${BASE_URL}/appointments`, { params });
    return { success: true, data: response.data };
  } catch (error) {
    console.error("API Error:", error.response?.data || error.message);
    return { success: false, error: error.response?.data || error.message };
  }
};

export const getAppointmentById = async (appointmentId) => {
  try {
    const response = await axios.get(`${BASE_URL}/appointments/${appointmentId}`);
    return { success: true, data: response.data };
  } catch (error) {
    console.error("API Error:", error.response?.data || error.message);
    return { success: false, error: error.response?.data || error.message };
  }
};

export const createAppointment = async (appointmentData) => {
  try {
    const response = await axios.post(`${BASE_URL}/appointments`, appointmentData);
    return { success: true, data: response.data };
  } catch (error) {
    console.error("API Error:", error.response?.data || error.message);
    return { success: false, error: error.response?.data || error.message };
  }
};

export const updateAppointment = async (appointmentId, appointmentData) => {
  try {
    const response = await axios.put(`${BASE_URL}/appointments/${appointmentId}`, appointmentData);
    return { success: true, data: response.data };
  } catch (error) {
    console.error("API Error:", error.response?.data || error.message);
    return { success: false, error: error.response?.data || error.message };
  }
};

export const cancelAppointment = async (appointmentId, reason) => {
  try {
    const response = await axios.patch(`${BASE_URL}/appointments/${appointmentId}/cancel`, { reason });
    return { success: true, data: response.data };
  } catch (error) {
    console.error("API Error:", error.response?.data || error.message);
    return { success: false, error: error.response?.data || error.message };
  }
};