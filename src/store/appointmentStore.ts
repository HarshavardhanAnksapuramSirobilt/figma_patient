import { create } from "zustand";
import type { 
  Appointment, 
  CreateAppointmentPayload, 
  AppointmentFilters,
  AppointmentStats,
  TimeSlot
} from "../types/appointment";
import type { Provider } from "../types/provider";

interface AppointmentState {
  // Appointment data
  appointments: Appointment[];
  currentAppointment: Appointment | null;
  appointmentStats: AppointmentStats | null;
  
  // Filters and pagination
  filters: AppointmentFilters;
  totalPages: number;
  totalElements: number;
  currentPage: number;
  
  // Loading states
  loading: boolean;
  creating: boolean;
  updating: boolean;
  
  // Calendar and scheduling
  selectedDate: string;
  selectedProvider: Provider | null;
  availableSlots: TimeSlot[];
  
  // Form data
  appointmentFormData: Partial<CreateAppointmentPayload> | null;
  
  // Actions
  setAppointments: (appointments: Appointment[]) => void;
  setCurrentAppointment: (appointment: Appointment | null) => void;
  setAppointmentStats: (stats: AppointmentStats) => void;
  setFilters: (filters: AppointmentFilters) => void;
  setPagination: (totalPages: number, totalElements: number, currentPage: number) => void;
  setLoading: (loading: boolean) => void;
  setCreating: (creating: boolean) => void;
  setUpdating: (updating: boolean) => void;
  setSelectedDate: (date: string) => void;
  setSelectedProvider: (provider: Provider | null) => void;
  setAvailableSlots: (slots: TimeSlot[]) => void;
  setAppointmentFormData: (data: Partial<CreateAppointmentPayload> | null) => void;
  clearAppointmentFormData: () => void;
  
  // Computed getters
  getTodayAppointments: () => Appointment[];
  getUpcomingAppointments: () => Appointment[];
  getAppointmentsByProvider: (providerId: string) => Appointment[];
  getAppointmentsByPatient: (patientId: string) => Appointment[];
  
  // Utility actions
  addAppointment: (appointment: Appointment) => void;
  updateAppointment: (appointmentId: string, updates: Partial<Appointment>) => void;
  removeAppointment: (appointmentId: string) => void;
  resetStore: () => void;
}

const initialState = {
  appointments: [],
  currentAppointment: null,
  appointmentStats: null,
  filters: {
    page: 0,
    size: 20
  },
  totalPages: 0,
  totalElements: 0,
  currentPage: 0,
  loading: false,
  creating: false,
  updating: false,
  selectedDate: new Date().toISOString().split('T')[0],
  selectedProvider: null,
  availableSlots: [],
  appointmentFormData: null
};

export const useAppointmentStore = create<AppointmentState>((set, get) => ({
  ...initialState,

  // Setters
  setAppointments: (appointments) => set({ appointments }),
  
  setCurrentAppointment: (appointment) => set({ currentAppointment: appointment }),
  
  setAppointmentStats: (stats) => set({ appointmentStats: stats }),
  
  setFilters: (filters) => set({ filters: { ...get().filters, ...filters } }),
  
  setPagination: (totalPages, totalElements, currentPage) => 
    set({ totalPages, totalElements, currentPage }),
  
  setLoading: (loading) => set({ loading }),
  
  setCreating: (creating) => set({ creating }),
  
  setUpdating: (updating) => set({ updating }),
  
  setSelectedDate: (date) => set({ selectedDate: date }),
  
  setSelectedProvider: (provider) => set({ selectedProvider: provider }),
  
  setAvailableSlots: (slots) => set({ availableSlots: slots }),
  
  setAppointmentFormData: (data) => set({ appointmentFormData: data }),
  
  clearAppointmentFormData: () => set({ appointmentFormData: null }),

  // Computed getters
  getTodayAppointments: () => {
    const today = new Date().toISOString().split('T')[0];
    return get().appointments.filter(apt => apt.appointmentDate === today);
  },

  getUpcomingAppointments: () => {
    const today = new Date().toISOString().split('T')[0];
    return get().appointments.filter(apt => apt.appointmentDate >= today);
  },

  getAppointmentsByProvider: (providerId: string) => {
    return get().appointments.filter(apt => apt.providerId === providerId);
  },

  getAppointmentsByPatient: (patientId: string) => {
    return get().appointments.filter(apt => apt.patientId === patientId);
  },

  // Utility actions
  addAppointment: (appointment) => {
    set(state => ({
      appointments: [...state.appointments, appointment]
    }));
  },

  updateAppointment: (appointmentId, updates) => {
    set(state => ({
      appointments: state.appointments.map(apt =>
        apt.appointmentId === appointmentId ? { ...apt, ...updates } : apt
      ),
      currentAppointment: state.currentAppointment?.appointmentId === appointmentId
        ? { ...state.currentAppointment, ...updates }
        : state.currentAppointment
    }));
  },

  removeAppointment: (appointmentId) => {
    set(state => ({
      appointments: state.appointments.filter(apt => apt.appointmentId !== appointmentId),
      currentAppointment: state.currentAppointment?.appointmentId === appointmentId
        ? null
        : state.currentAppointment
    }));
  },

  resetStore: () => set(initialState)
}));
