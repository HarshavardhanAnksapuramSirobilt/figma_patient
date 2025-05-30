import axios from "axios";

const BASE_URL = import.meta.env.VITE_API_BASE_URL;

export const getProviders = async () => {
  try {
    const response = await axios.get(`${BASE_URL}/providers`);
    return { success: true, data: response.data };
  } catch (error) {
    console.error("API Error:", error.response?.data || error.message);
    return { success: false, error: error.response?.data || error.message };
  }
};

export const getProviderById = async (providerId) => {
  try {
    const response = await axios.get(`${BASE_URL}/providers/${providerId}`);
    return { success: true, data: response.data };
  } catch (error) {
    console.error("API Error:", error.response?.data || error.message);
    return { success: false, error: error.response?.data || error.message };
  }
};

export const createProvider = async (providerData) => {
  try {
    const response = await axios.post(`${BASE_URL}/providers`, providerData);
    return { success: true, data: response.data };
  } catch (error) {
    console.error("API Error:", error.response?.data || error.message);
    return { success: false, error: error.response?.data || error.message };
  }
};

export const updateProvider = async (providerId, providerData) => {
  try {
    const response = await axios.put(`${BASE_URL}/providers/${providerId}`, providerData);
    return { success: true, data: response.data };
  } catch (error) {
    console.error("API Error:", error.response?.data || error.message);
    return { success: false, error: error.response?.data || error.message };
  }
};

export const deleteProvider = async (providerId) => {
  try {
    const response = await axios.delete(`${BASE_URL}/providers/${providerId}`);
    return { success: true, data: response.data };
  } catch (error) {
    console.error("API Error:", error.response?.data || error.message);
    return { success: false, error: error.response?.data || error.message };
  }
};

export const getProviderAvailability = async (providerId, startDate, endDate) => {
  try {
    const params = { startDate, endDate };
    const response = await axios.get(`${BASE_URL}/providers/${providerId}/availability`, { params });
    return { success: true, data: response.data };
  } catch (error) {
    console.error("API Error:", error.response?.data || error.message);
    return { success: false, error: error.response?.data || error.message };
  }
};