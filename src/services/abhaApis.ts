import axios from 'axios';

const ABHA_BASE_URL = import.meta.env.VITE_ABHA_BASE_URL;

interface AadhaarOtpPayload {
  aadhaarNumber: string;
}

interface EnrollByOtpPayload {
  txnId: string;
  otp: string;
  mobile: string;
}

export const requestAadhaarOtp = async (payload: AadhaarOtpPayload) => {
  try {
    const response = await axios.post(`${ABHA_BASE_URL}/abha/aadhaar-otp`, payload);
    return { success: true, data: response.data };
  } catch (error: any) {
    console.error("OTP Request Error:", error.response?.data || error.message);
    return { success: false, error: error.response?.data || error.message };
  }
};

export const enrollAbhaByOtp = async (payload: EnrollByOtpPayload) => {
  try {
    const response = await axios.post(`${ABHA_BASE_URL}/abha/enroll/by-otp`, payload);
    return { success: true, data: response.data };
  } catch (error: any) {
    console.error("Enroll by OTP Error:", error.response?.data || error.message);
    return { success: false, error: error.response?.data || error.message };
  }
};