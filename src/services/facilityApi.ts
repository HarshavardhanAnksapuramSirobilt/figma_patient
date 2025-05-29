import axios from "axios";

const BASE_URL = import.meta.env.VITE_API_BASE_URL;

export const fetchFacilities = async (name: string) => {
  const params = new URLSearchParams({ name, page: "0", size: "10" });
  const response = await axios.get(`${BASE_URL}/facilities/suggest?${params}`);
  return response.data.results || [];
};

export const fetchFacilityLabel = async (value: string) => {
  const params = new URLSearchParams({ name: "", page: "0", size: "50" });
  const response = await axios.get(`${BASE_URL}/facilities/suggest?${params}`);
  const found = response.data.results.find(
    (f: { hospitalId: string }) => f.hospitalId === value
  );
  return found?.facilityName || "";
};
