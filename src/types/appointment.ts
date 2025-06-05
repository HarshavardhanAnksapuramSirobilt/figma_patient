import {
  AppointmentStatus,
  AppointmentType,
  AppointmentPriority,
  RecurringPattern,
  SlotDuration
} from "./appointmentenums";

// Core Appointment Interface
export interface Appointment {
  appointmentId?: string;
  patientId: string;
  providerId: string;
  facilityId: string;
  
  // Appointment Details
  appointmentDate: string; // ISO date string
  startTime: string; // HH:MM format
  endTime: string; // HH:MM format
  duration: SlotDuration;
  
  // Classification
  type: AppointmentType;
  status: AppointmentStatus;
  priority: AppointmentPriority;
  
  // Description & Notes
  title?: string;
  description?: string;
  notes?: string;
  reason?: string;
  
  // Recurring Appointments
  isRecurring?: boolean;
  recurringPattern?: RecurringPattern;
  recurringEndDate?: string;
  parentAppointmentId?: string; // For recurring appointments
  
  // Metadata
  createdAt?: string;
  updatedAt?: string;
  createdBy?: string;
  updatedBy?: string;
  
  // Patient & Provider Info (populated from relations)
  patient?: {
    firstName: string;
    lastName: string;
    mobileNumber?: string;
    email?: string;
  };
  
  provider?: {
    firstName: string;
    lastName: string;
    specialization: string;
    title: string;
  };
  
  facility?: {
    facilityName: string;
    address: string;
  };
}

// Appointment Creation Payload
export interface CreateAppointmentPayload {
  patientId: string;
  providerId: string;
  facilityId: string;
  appointmentDate: string;
  startTime: string;
  endTime: string;
  duration: SlotDuration;
  type: AppointmentType;
  priority: AppointmentPriority;
  title?: string;
  description?: string;
  notes?: string;
  reason?: string;
  isRecurring?: boolean;
  recurringPattern?: RecurringPattern;
  recurringEndDate?: string;
}

// Appointment Update Payload
export interface UpdateAppointmentPayload extends Partial<CreateAppointmentPayload> {
  status?: AppointmentStatus;
  notes?: string;
}

// Appointment Search/Filter Parameters
export interface AppointmentFilters {
  patientId?: string;
  providerId?: string;
  facilityId?: string;
  status?: AppointmentStatus[];
  type?: AppointmentType[];
  priority?: AppointmentPriority[];
  dateFrom?: string;
  dateTo?: string;
  searchTerm?: string;
  page?: number;
  size?: number;
}

// Time Slot Interface
export interface TimeSlot {
  startTime: string;
  endTime: string;
  isAvailable: boolean;
  appointmentId?: string;
  isBlocked?: boolean;
  blockReason?: string;
}

// Provider Schedule Interface
export interface ProviderSchedule {
  providerId: string;
  date: string;
  timeSlots: TimeSlot[];
  workingHours: {
    startTime: string;
    endTime: string;
  };
  isWorkingDay: boolean;
  specialNotes?: string;
}

// Appointment Statistics
export interface AppointmentStats {
  totalAppointments: number;
  todayAppointments: number;
  upcomingAppointments: number;
  completedAppointments: number;
  cancelledAppointments: number;
  noShowAppointments: number;
  statusBreakdown: Record<AppointmentStatus, number>;
  typeBreakdown: Record<AppointmentType, number>;
}

// Default appointment payload
export const defaultAppointmentPayload: CreateAppointmentPayload = {
  patientId: "",
  providerId: "",
  facilityId: "",
  appointmentDate: "",
  startTime: "",
  endTime: "",
  duration: SlotDuration.Thirty,
  type: AppointmentType.Consultation,
  priority: AppointmentPriority.Normal,
  title: "",
  description: "",
  notes: "",
  reason: "",
  isRecurring: false,
  recurringPattern: RecurringPattern.None,
  recurringEndDate: ""
};
