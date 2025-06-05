import axios from "axios";
import type {
  Appointment,
  CreateAppointmentPayload,
  UpdateAppointmentPayload,
  AppointmentFilters,
  AppointmentStats,
  ProviderSchedule,
  TimeSlot
} from '../types/appointment';
import {
  mockAppointments,
  mockAppointmentStats,
  mockTimeSlots,
  mockProviderSchedule,
  generateMoreAppointments
} from '../mockData/appointmentMockData';

const BASE_URL = "https://megha-dev.sirobilt.com/api";
const USE_MOCK_DATA = true; // Set to false to use real API

// Mock data storage (simulates database)
let mockAppointmentData = [...mockAppointments, ...generateMoreAppointments(20)];

// Create a new appointment
export const createAppointment = async (payload: CreateAppointmentPayload) => {
  if (USE_MOCK_DATA) {
    try {
      console.log("Creating appointment with payload:", payload);

      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 500));

      // Create new appointment with generated ID
      const newAppointment: Appointment = {
        ...payload,
        appointmentId: `apt-${Date.now()}`,
        status: "Scheduled" as any,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        // Add mock patient and provider data
        patient: {
          firstName: "Mock",
          lastName: "Patient",
          mobileNumber: "+1-555-0000",
          email: "mock.patient@email.com"
        },
        provider: {
          firstName: "Mock",
          lastName: "Provider",
          specialization: "General",
          title: "Dr."
        },
        facility: {
          facilityName: "City General Hospital",
          address: "123 Main St, City, State 12345"
        }
      };

      // Add to mock data
      mockAppointmentData.push(newAppointment);

      return { success: true, data: newAppointment };
    } catch (error: any) {
      console.error("Create Appointment Error:", error);
      return { success: false, error: "Failed to create appointment" };
    }
  } else {
    try {
      console.log("Creating appointment with payload:", payload);
      const response = await axios.post(`${BASE_URL}/appointments`, payload);
      return { success: true, data: response.data };
    } catch (error: any) {
      console.error("Create Appointment Error:", error.response?.data || error.message);
      return { success: false, error: error.response?.data || error.message };
    }
  }
};

// Get appointment by ID
export const getAppointmentById = async (id: string) => {
  try {
    const response = await axios.get(`${BASE_URL}/appointments/${id}`);
    return response.data;
  } catch (error: any) {
    console.error("Fetch Appointment Error:", error);
    throw new Error("Failed to fetch appointment data");
  }
};

// Update an existing appointment
export const updateAppointment = async (id: string, payload: UpdateAppointmentPayload) => {
  try {
    const response = await axios.put(`${BASE_URL}/appointments/${id}`, payload);
    return { success: true, data: response.data };
  } catch (error: any) {
    console.error("Update Appointment Error:", error);
    return { success: false, error: error.response?.data || error.message };
  }
};

// Get appointments with filters
export const getAppointments = async (filters: AppointmentFilters = {}) => {
  if (USE_MOCK_DATA) {
    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 300));

      let filteredAppointments = [...mockAppointmentData];

      // Apply filters
      if (filters.patientId) {
        filteredAppointments = filteredAppointments.filter(apt => apt.patientId === filters.patientId);
      }
      if (filters.providerId) {
        filteredAppointments = filteredAppointments.filter(apt => apt.providerId === filters.providerId);
      }
      if (filters.facilityId) {
        filteredAppointments = filteredAppointments.filter(apt => apt.facilityId === filters.facilityId);
      }
      if (filters.status?.length) {
        filteredAppointments = filteredAppointments.filter(apt => filters.status!.includes(apt.status));
      }
      if (filters.type?.length) {
        filteredAppointments = filteredAppointments.filter(apt => filters.type!.includes(apt.type));
      }
      if (filters.priority?.length) {
        filteredAppointments = filteredAppointments.filter(apt => filters.priority!.includes(apt.priority));
      }
      if (filters.dateFrom) {
        filteredAppointments = filteredAppointments.filter(apt => apt.appointmentDate >= filters.dateFrom!);
      }
      if (filters.dateTo) {
        filteredAppointments = filteredAppointments.filter(apt => apt.appointmentDate <= filters.dateTo!);
      }
      if (filters.searchTerm) {
        const searchLower = filters.searchTerm.toLowerCase();
        filteredAppointments = filteredAppointments.filter(apt =>
          apt.patient?.firstName?.toLowerCase().includes(searchLower) ||
          apt.patient?.lastName?.toLowerCase().includes(searchLower) ||
          apt.provider?.firstName?.toLowerCase().includes(searchLower) ||
          apt.provider?.lastName?.toLowerCase().includes(searchLower) ||
          apt.title?.toLowerCase().includes(searchLower) ||
          apt.description?.toLowerCase().includes(searchLower)
        );
      }

      // Sort by date and time
      filteredAppointments.sort((a, b) => {
        const dateComparison = a.appointmentDate.localeCompare(b.appointmentDate);
        if (dateComparison !== 0) return dateComparison;
        return a.startTime.localeCompare(b.startTime);
      });

      // Apply pagination
      const page = filters.page || 0;
      const size = filters.size || 20;
      const startIndex = page * size;
      const endIndex = startIndex + size;
      const paginatedResults = filteredAppointments.slice(startIndex, endIndex);

      return {
        results: paginatedResults,
        totalElements: filteredAppointments.length,
        totalPages: Math.ceil(filteredAppointments.length / size),
        page: page,
        size: size
      };
    } catch (error: any) {
      console.error("Failed to fetch appointments:", error);
      return { results: [], totalElements: 0, totalPages: 0 };
    }
  } else {
    try {
      const params = new URLSearchParams();

      // Add filter parameters
      if (filters.patientId) params.append('patientId', filters.patientId);
      if (filters.providerId) params.append('providerId', filters.providerId);
      if (filters.facilityId) params.append('facilityId', filters.facilityId);
      if (filters.status?.length) params.append('status', filters.status.join(','));
      if (filters.type?.length) params.append('type', filters.type.join(','));
      if (filters.priority?.length) params.append('priority', filters.priority.join(','));
      if (filters.dateFrom) params.append('dateFrom', filters.dateFrom);
      if (filters.dateTo) params.append('dateTo', filters.dateTo);
      if (filters.searchTerm) params.append('search', filters.searchTerm);
      if (filters.page !== undefined) params.append('page', filters.page.toString());
      if (filters.size !== undefined) params.append('size', filters.size.toString());

      const response = await axios.get(`${BASE_URL}/appointments?${params}`);
      return response.data;
    } catch (error: any) {
      console.error("Failed to fetch appointments:", error);
      return { results: [], totalElements: 0, totalPages: 0 };
    }
  }
};

// Delete an appointment
export const deleteAppointment = async (id: string) => {
  try {
    await axios.delete(`${BASE_URL}/appointments/${id}`);
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.response?.data || error.message };
  }
};

// Cancel an appointment
export const cancelAppointment = async (id: string, reason?: string) => {
  try {
    const response = await axios.patch(`${BASE_URL}/appointments/${id}/cancel`, { reason });
    return { success: true, data: response.data };
  } catch (error: any) {
    return { success: false, error: error.response?.data || error.message };
  }
};

// Confirm an appointment
export const confirmAppointment = async (id: string) => {
  try {
    const response = await axios.patch(`${BASE_URL}/appointments/${id}/confirm`);
    return { success: true, data: response.data };
  } catch (error: any) {
    return { success: false, error: error.response?.data || error.message };
  }
};

// Complete an appointment
export const completeAppointment = async (id: string, notes?: string) => {
  try {
    const response = await axios.patch(`${BASE_URL}/appointments/${id}/complete`, { notes });
    return { success: true, data: response.data };
  } catch (error: any) {
    return { success: false, error: error.response?.data || error.message };
  }
};

// Reschedule an appointment
export const rescheduleAppointment = async (
  id: string, 
  newDate: string, 
  newStartTime: string, 
  newEndTime: string,
  reason?: string
) => {
  try {
    const payload = {
      appointmentDate: newDate,
      startTime: newStartTime,
      endTime: newEndTime,
      reason
    };
    const response = await axios.patch(`${BASE_URL}/appointments/${id}/reschedule`, payload);
    return { success: true, data: response.data };
  } catch (error: any) {
    return { success: false, error: error.response?.data || error.message };
  }
};

// Get provider schedule for a specific date
export const getProviderSchedule = async (providerId: string, date: string): Promise<ProviderSchedule> => {
  try {
    const response = await axios.get(`${BASE_URL}/providers/${providerId}/schedule/${date}`);
    return response.data;
  } catch (error: any) {
    console.error("Failed to fetch provider schedule:", error);
    throw new Error("Failed to fetch provider schedule");
  }
};

// Get available time slots for a provider on a specific date
export const getAvailableSlots = async (providerId: string, date: string): Promise<TimeSlot[]> => {
  if (USE_MOCK_DATA) {
    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 300));

      // Return mock time slots (you can customize this based on providerId and date)
      return mockTimeSlots;
    } catch (error: any) {
      console.error("Failed to fetch available slots:", error);
      return [];
    }
  } else {
    try {
      const response = await axios.get(`${BASE_URL}/providers/${providerId}/available-slots/${date}`);
      return response.data;
    } catch (error: any) {
      console.error("Failed to fetch available slots:", error);
      return [];
    }
  }
};

// Get appointment statistics
export const getAppointmentStats = async (facilityId?: string, dateFrom?: string, dateTo?: string): Promise<AppointmentStats> => {
  if (USE_MOCK_DATA) {
    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 200));

      return mockAppointmentStats;
    } catch (error: any) {
      console.error("Failed to fetch appointment stats:", error);
      throw new Error("Failed to fetch appointment statistics");
    }
  } else {
    try {
      const params = new URLSearchParams();
      if (facilityId) params.append('facilityId', facilityId);
      if (dateFrom) params.append('dateFrom', dateFrom);
      if (dateTo) params.append('dateTo', dateTo);

      const response = await axios.get(`${BASE_URL}/appointments/stats?${params}`);
      return response.data;
    } catch (error: any) {
      console.error("Failed to fetch appointment stats:", error);
      throw new Error("Failed to fetch appointment statistics");
    }
  }
};

// Get appointments for today
export const getTodayAppointments = async (facilityId?: string) => {
  const today = new Date().toISOString().split('T')[0];
  return getAppointments({
    facilityId,
    dateFrom: today,
    dateTo: today,
    page: 0,
    size: 100
  });
};

// Get upcoming appointments
export const getUpcomingAppointments = async (facilityId?: string, days: number = 7) => {
  const today = new Date();
  const futureDate = new Date(today.getTime() + (days * 24 * 60 * 60 * 1000));
  
  return getAppointments({
    facilityId,
    dateFrom: today.toISOString().split('T')[0],
    dateTo: futureDate.toISOString().split('T')[0],
    page: 0,
    size: 100
  });
};
