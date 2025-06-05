import {
  ProviderSpecialization,
  ProviderStatus,
  DayOfWeek,
  SlotDuration
} from "./appointmentenums";

// Healthcare Provider Interface
export interface Provider {
  providerId: string;
  facilityId: string;
  
  // Personal Information
  title: string; // Dr., Prof., etc.
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  
  // Professional Information
  specialization: ProviderSpecialization;
  licenseNumber: string;
  qualification: string;
  experience: number; // years
  department: string;
  
  // Status & Availability
  status: ProviderStatus;
  isActive: boolean;
  
  // Schedule Configuration
  defaultSlotDuration: SlotDuration;
  consultationFee?: number;
  
  // Working Hours (default schedule)
  workingHours: WorkingHours[];
  
  // Metadata
  createdAt?: string;
  updatedAt?: string;
  profileImage?: string;
  bio?: string;
}

// Working Hours for each day
export interface WorkingHours {
  dayOfWeek: DayOfWeek;
  isWorkingDay: boolean;
  startTime: string; // HH:MM format
  endTime: string; // HH:MM format
  breakStartTime?: string;
  breakEndTime?: string;
  slotDuration: SlotDuration;
}

// Provider Availability for specific dates
export interface ProviderAvailability {
  providerId: string;
  date: string; // YYYY-MM-DD
  isAvailable: boolean;
  customStartTime?: string;
  customEndTime?: string;
  customBreakStart?: string;
  customBreakEnd?: string;
  notes?: string;
  reason?: string; // if not available
}

// Provider Schedule Block (for blocking time slots)
export interface ScheduleBlock {
  blockId?: string;
  providerId: string;
  date: string;
  startTime: string;
  endTime: string;
  reason: string;
  isRecurring?: boolean;
  recurringPattern?: string;
  createdBy: string;
  createdAt?: string;
}

// Provider Search/Filter Parameters
export interface ProviderFilters {
  facilityId?: string;
  specialization?: ProviderSpecialization[];
  status?: ProviderStatus[];
  isActive?: boolean;
  searchTerm?: string;
  availableOn?: string; // date for availability check
  page?: number;
  size?: number;
}

// Provider Statistics
export interface ProviderStats {
  totalProviders: number;
  activeProviders: number;
  availableProviders: number;
  busyProviders: number;
  onLeaveProviders: number;
  specializationBreakdown: Record<ProviderSpecialization, number>;
  appointmentsToday: number;
  appointmentsThisWeek: number;
  appointmentsThisMonth: number;
}

// Provider Profile for display
export interface ProviderProfile {
  providerId: string;
  fullName: string;
  title: string;
  specialization: ProviderSpecialization;
  qualification: string;
  experience: number;
  department: string;
  consultationFee?: number;
  profileImage?: string;
  bio?: string;
  rating?: number;
  totalReviews?: number;
  nextAvailableSlot?: string;
}

// Default working hours (Monday to Friday, 9 AM to 5 PM)
export const defaultWorkingHours: WorkingHours[] = [
  {
    dayOfWeek: DayOfWeek.Monday,
    isWorkingDay: true,
    startTime: "09:00",
    endTime: "17:00",
    breakStartTime: "13:00",
    breakEndTime: "14:00",
    slotDuration: SlotDuration.Thirty
  },
  {
    dayOfWeek: DayOfWeek.Tuesday,
    isWorkingDay: true,
    startTime: "09:00",
    endTime: "17:00",
    breakStartTime: "13:00",
    breakEndTime: "14:00",
    slotDuration: SlotDuration.Thirty
  },
  {
    dayOfWeek: DayOfWeek.Wednesday,
    isWorkingDay: true,
    startTime: "09:00",
    endTime: "17:00",
    breakStartTime: "13:00",
    breakEndTime: "14:00",
    slotDuration: SlotDuration.Thirty
  },
  {
    dayOfWeek: DayOfWeek.Thursday,
    isWorkingDay: true,
    startTime: "09:00",
    endTime: "17:00",
    breakStartTime: "13:00",
    breakEndTime: "14:00",
    slotDuration: SlotDuration.Thirty
  },
  {
    dayOfWeek: DayOfWeek.Friday,
    isWorkingDay: true,
    startTime: "09:00",
    endTime: "17:00",
    breakStartTime: "13:00",
    breakEndTime: "14:00",
    slotDuration: SlotDuration.Thirty
  },
  {
    dayOfWeek: DayOfWeek.Saturday,
    isWorkingDay: false,
    startTime: "09:00",
    endTime: "13:00",
    slotDuration: SlotDuration.Thirty
  },
  {
    dayOfWeek: DayOfWeek.Sunday,
    isWorkingDay: false,
    startTime: "09:00",
    endTime: "13:00",
    slotDuration: SlotDuration.Thirty
  }
];
