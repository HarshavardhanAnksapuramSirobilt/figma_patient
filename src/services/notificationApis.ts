import axios from "axios";

const BASE_URL = import.meta.env.VITE_API_BASE_URL;

export const sendNotification = async (notificationData) => {
  try {
    const response = await axios.post(`${BASE_URL}/notifications`, notificationData);
    return { success: true, data: response.data };
  } catch (error) {
    console.error("API Error:", error.response?.data || error.message);
    return { success: false, error: error.response?.data || error.message };
  }
};

export const getNotificationHistory = async (patientId) => {
  try {
    const response = await axios.get(`${BASE_URL}/notifications/history/${patientId}`);
    return { success: true, data: response.data };
  } catch (error) {
    console.error("API Error:", error.response?.data || error.message);
    return { success: false, error: error.response?.data || error.message };
  }
};