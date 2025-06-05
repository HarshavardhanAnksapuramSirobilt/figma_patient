import axios from "axios";
import type {
  Provider,
  ProviderFilters,
  ProviderStats,
  ProviderProfile,
  ProviderAvailability,
  ScheduleBlock,
  WorkingHours
} from '../types/provider';
import { mockProviders } from '../mockData/appointmentMockData';

const BASE_URL = "https://megha-dev.sirobilt.com/api";
const USE_MOCK_DATA = true; // Set to false to use real API

// Get all providers with filters
export const getProviders = async (filters: ProviderFilters = {}) => {
  if (USE_MOCK_DATA) {
    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 300));

      let filteredProviders = [...mockProviders];

      // Apply filters
      if (filters.facilityId) {
        filteredProviders = filteredProviders.filter(provider => provider.facilityId === filters.facilityId);
      }
      if (filters.specialization?.length) {
        filteredProviders = filteredProviders.filter(provider => filters.specialization!.includes(provider.specialization));
      }
      if (filters.status?.length) {
        filteredProviders = filteredProviders.filter(provider => filters.status!.includes(provider.status));
      }
      if (filters.isActive !== undefined) {
        filteredProviders = filteredProviders.filter(provider => provider.isActive === filters.isActive);
      }
      if (filters.searchTerm) {
        const searchLower = filters.searchTerm.toLowerCase();
        filteredProviders = filteredProviders.filter(provider =>
          provider.firstName.toLowerCase().includes(searchLower) ||
          provider.lastName.toLowerCase().includes(searchLower) ||
          provider.specialization.toLowerCase().includes(searchLower) ||
          provider.department.toLowerCase().includes(searchLower)
        );
      }

      // Apply pagination
      const page = filters.page || 0;
      const size = filters.size || 20;
      const startIndex = page * size;
      const endIndex = startIndex + size;
      const paginatedResults = filteredProviders.slice(startIndex, endIndex);

      return {
        results: paginatedResults,
        totalElements: filteredProviders.length,
        totalPages: Math.ceil(filteredProviders.length / size),
        page: page,
        size: size
      };
    } catch (error: any) {
      console.error("Failed to fetch providers:", error);
      return { results: [], totalElements: 0, totalPages: 0 };
    }
  } else {
    try {
      const params = new URLSearchParams();

      // Add filter parameters
      if (filters.facilityId) params.append('facilityId', filters.facilityId);
      if (filters.specialization?.length) params.append('specialization', filters.specialization.join(','));
      if (filters.status?.length) params.append('status', filters.status.join(','));
      if (filters.isActive !== undefined) params.append('isActive', filters.isActive.toString());
      if (filters.searchTerm) params.append('search', filters.searchTerm);
      if (filters.availableOn) params.append('availableOn', filters.availableOn);
      if (filters.page !== undefined) params.append('page', filters.page.toString());
      if (filters.size !== undefined) params.append('size', filters.size.toString());

      const response = await axios.get(`${BASE_URL}/providers?${params}`);
      return response.data;
    } catch (error: any) {
      console.error("Failed to fetch providers:", error);
      return { results: [], totalElements: 0, totalPages: 0 };
    }
  }
};

// Get provider by ID
export const getProviderById = async (id: string): Promise<Provider> => {
  try {
    const response = await axios.get(`${BASE_URL}/providers/${id}`);
    return response.data;
  } catch (error: any) {
    console.error("Fetch Provider Error:", error);
    throw new Error("Failed to fetch provider data");
  }
};

// Create a new provider
export const createProvider = async (payload: Omit<Provider, 'providerId'>) => {
  try {
    console.log("Creating provider with payload:", payload);
    const response = await axios.post(`${BASE_URL}/providers`, payload);
    return { success: true, data: response.data };
  } catch (error: any) {
    console.error("Create Provider Error:", error.response?.data || error.message);
    return { success: false, error: error.response?.data || error.message };
  }
};

// Update an existing provider
export const updateProvider = async (id: string, payload: Partial<Provider>) => {
  try {
    const response = await axios.put(`${BASE_URL}/providers/${id}`, payload);
    return { success: true, data: response.data };
  } catch (error: any) {
    console.error("Update Provider Error:", error);
    return { success: false, error: error.response?.data || error.message };
  }
};

// Delete a provider
export const deleteProvider = async (id: string) => {
  try {
    await axios.delete(`${BASE_URL}/providers/${id}`);
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.response?.data || error.message };
  }
};

// Get provider profile (public information)
export const getProviderProfile = async (id: string): Promise<ProviderProfile> => {
  try {
    const response = await axios.get(`${BASE_URL}/providers/${id}/profile`);
    return response.data;
  } catch (error: any) {
    console.error("Failed to fetch provider profile:", error);
    throw new Error("Failed to fetch provider profile");
  }
};

// Get provider working hours
export const getProviderWorkingHours = async (id: string): Promise<WorkingHours[]> => {
  try {
    const response = await axios.get(`${BASE_URL}/providers/${id}/working-hours`);
    return response.data;
  } catch (error: any) {
    console.error("Failed to fetch working hours:", error);
    return [];
  }
};

// Update provider working hours
export const updateProviderWorkingHours = async (id: string, workingHours: WorkingHours[]) => {
  try {
    const response = await axios.put(`${BASE_URL}/providers/${id}/working-hours`, { workingHours });
    return { success: true, data: response.data };
  } catch (error: any) {
    return { success: false, error: error.response?.data || error.message };
  }
};

// Get provider availability for a specific date
export const getProviderAvailability = async (id: string, date: string): Promise<ProviderAvailability | null> => {
  try {
    const response = await axios.get(`${BASE_URL}/providers/${id}/availability/${date}`);
    return response.data;
  } catch (error: any) {
    console.error("Failed to fetch provider availability:", error);
    return null;
  }
};

// Set provider availability for a specific date
export const setProviderAvailability = async (availability: ProviderAvailability) => {
  try {
    const response = await axios.post(`${BASE_URL}/providers/availability`, availability);
    return { success: true, data: response.data };
  } catch (error: any) {
    return { success: false, error: error.response?.data || error.message };
  }
};

// Get provider schedule blocks
export const getProviderScheduleBlocks = async (id: string, dateFrom?: string, dateTo?: string): Promise<ScheduleBlock[]> => {
  try {
    const params = new URLSearchParams();
    if (dateFrom) params.append('dateFrom', dateFrom);
    if (dateTo) params.append('dateTo', dateTo);

    const response = await axios.get(`${BASE_URL}/providers/${id}/schedule-blocks?${params}`);
    return response.data;
  } catch (error: any) {
    console.error("Failed to fetch schedule blocks:", error);
    return [];
  }
};

// Create a schedule block
export const createScheduleBlock = async (block: Omit<ScheduleBlock, 'blockId'>) => {
  try {
    const response = await axios.post(`${BASE_URL}/providers/schedule-blocks`, block);
    return { success: true, data: response.data };
  } catch (error: any) {
    return { success: false, error: error.response?.data || error.message };
  }
};

// Delete a schedule block
export const deleteScheduleBlock = async (blockId: string) => {
  try {
    await axios.delete(`${BASE_URL}/providers/schedule-blocks/${blockId}`);
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.response?.data || error.message };
  }
};

// Get provider statistics
export const getProviderStats = async (facilityId?: string): Promise<ProviderStats> => {
  try {
    const params = new URLSearchParams();
    if (facilityId) params.append('facilityId', facilityId);

    const response = await axios.get(`${BASE_URL}/providers/stats?${params}`);
    return response.data;
  } catch (error: any) {
    console.error("Failed to fetch provider stats:", error);
    throw new Error("Failed to fetch provider statistics");
  }
};

// Search providers by name or specialization
export const searchProviders = async (searchTerm: string, facilityId?: string) => {
  return getProviders({
    searchTerm,
    facilityId,
    isActive: true,
    page: 0,
    size: 20
  });
};

// Get available providers for a specific date and time
export const getAvailableProviders = async (
  date: string, 
  startTime: string, 
  endTime: string, 
  facilityId?: string,
  specialization?: string
) => {
  try {
    const params = new URLSearchParams();
    params.append('date', date);
    params.append('startTime', startTime);
    params.append('endTime', endTime);
    if (facilityId) params.append('facilityId', facilityId);
    if (specialization) params.append('specialization', specialization);

    const response = await axios.get(`${BASE_URL}/providers/available?${params}`);
    return response.data;
  } catch (error: any) {
    console.error("Failed to fetch available providers:", error);
    return [];
  }
};
