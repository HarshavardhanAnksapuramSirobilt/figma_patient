import {
  AppointmentStatus,
  AppointmentType,
  AppointmentPriority,
  SlotDuration,
  ProviderSpecialization,
  ProviderStatus,
  NotificationType,
  NotificationStatus,
  AuditAction
} from "../types/appointmentenums";
import type { Appointment, AppointmentStats, TimeSlot, ProviderSchedule } from "../types/appointment";
import type { Provider } from "../types/provider";
import type { Notification } from "../types/notification";
import type { AuditTrail } from "../services/auditApis";

// Mock Providers
export const mockProviders: Provider[] = [
  {
    providerId: "prov-001",
    facilityId: "fac-001",
    title: "Dr.",
    firstName: "Sarah",
    lastName: "Johnson",
    email: "sarah.johnson@hospital.com",
    phoneNumber: "+1-555-0101",
    specialization: ProviderSpecialization.Cardiology,
    licenseNumber: "MD-12345",
    qualification: "MD, FACC",
    experience: 15,
    department: "Cardiology",
    status: ProviderStatus.Available,
    isActive: true,
    defaultSlotDuration: SlotDuration.Thirty,
    consultationFee: 250,
    workingHours: [
      {
        dayOfWeek: "Monday",
        isWorkingDay: true,
        startTime: "09:00",
        endTime: "17:00",
        breakStartTime: "13:00",
        breakEndTime: "14:00",
        slotDuration: SlotDuration.Thirty
      },
      {
        dayOfWeek: "Tuesday",
        isWorkingDay: true,
        startTime: "09:00",
        endTime: "17:00",
        breakStartTime: "13:00",
        breakEndTime: "14:00",
        slotDuration: SlotDuration.Thirty
      },
      {
        dayOfWeek: "Wednesday",
        isWorkingDay: true,
        startTime: "09:00",
        endTime: "17:00",
        breakStartTime: "13:00",
        breakEndTime: "14:00",
        slotDuration: SlotDuration.Thirty
      },
      {
        dayOfWeek: "Thursday",
        isWorkingDay: true,
        startTime: "09:00",
        endTime: "17:00",
        breakStartTime: "13:00",
        breakEndTime: "14:00",
        slotDuration: SlotDuration.Thirty
      },
      {
        dayOfWeek: "Friday",
        isWorkingDay: true,
        startTime: "09:00",
        endTime: "17:00",
        breakStartTime: "13:00",
        breakEndTime: "14:00",
        slotDuration: SlotDuration.Thirty
      },
      {
        dayOfWeek: "Saturday",
        isWorkingDay: false,
        startTime: "09:00",
        endTime: "13:00",
        slotDuration: SlotDuration.Thirty
      },
      {
        dayOfWeek: "Sunday",
        isWorkingDay: false,
        startTime: "09:00",
        endTime: "13:00",
        slotDuration: SlotDuration.Thirty
      }
    ],
    bio: "Experienced cardiologist specializing in interventional cardiology and heart disease prevention."
  },
  {
    providerId: "prov-002",
    facilityId: "fac-001",
    title: "Dr.",
    firstName: "Michael",
    lastName: "Chen",
    email: "michael.chen@hospital.com",
    phoneNumber: "+1-555-0102",
    specialization: ProviderSpecialization.Pediatrics,
    licenseNumber: "MD-12346",
    qualification: "MD, FAAP",
    experience: 12,
    department: "Pediatrics",
    status: ProviderStatus.Available,
    isActive: true,
    defaultSlotDuration: SlotDuration.Thirty,
    consultationFee: 200,
    workingHours: [
      {
        dayOfWeek: "Monday",
        isWorkingDay: true,
        startTime: "08:00",
        endTime: "16:00",
        breakStartTime: "12:00",
        breakEndTime: "13:00",
        slotDuration: SlotDuration.Thirty
      },
      {
        dayOfWeek: "Tuesday",
        isWorkingDay: true,
        startTime: "08:00",
        endTime: "16:00",
        breakStartTime: "12:00",
        breakEndTime: "13:00",
        slotDuration: SlotDuration.Thirty
      },
      {
        dayOfWeek: "Wednesday",
        isWorkingDay: true,
        startTime: "08:00",
        endTime: "16:00",
        breakStartTime: "12:00",
        breakEndTime: "13:00",
        slotDuration: SlotDuration.Thirty
      },
      {
        dayOfWeek: "Thursday",
        isWorkingDay: true,
        startTime: "08:00",
        endTime: "16:00",
        breakStartTime: "12:00",
        breakEndTime: "13:00",
        slotDuration: SlotDuration.Thirty
      },
      {
        dayOfWeek: "Friday",
        isWorkingDay: true,
        startTime: "08:00",
        endTime: "16:00",
        breakStartTime: "12:00",
        breakEndTime: "13:00",
        slotDuration: SlotDuration.Thirty
      },
      {
        dayOfWeek: "Saturday",
        isWorkingDay: true,
        startTime: "09:00",
        endTime: "13:00",
        slotDuration: SlotDuration.Thirty
      },
      {
        dayOfWeek: "Sunday",
        isWorkingDay: false,
        startTime: "09:00",
        endTime: "13:00",
        slotDuration: SlotDuration.Thirty
      }
    ],
    bio: "Board-certified pediatrician with expertise in child development and preventive care."
  },
  {
    providerId: "prov-003",
    facilityId: "fac-001",
    title: "Dr.",
    firstName: "Emily",
    lastName: "Rodriguez",
    email: "emily.rodriguez@hospital.com",
    phoneNumber: "+1-555-0103",
    specialization: ProviderSpecialization.Orthopedics,
    licenseNumber: "MD-12347",
    qualification: "MD, FAAOS",
    experience: 18,
    department: "Orthopedics",
    status: ProviderStatus.Busy,
    isActive: true,
    defaultSlotDuration: SlotDuration.FortyFive,
    consultationFee: 300,
    workingHours: [
      {
        dayOfWeek: "Monday",
        isWorkingDay: true,
        startTime: "10:00",
        endTime: "18:00",
        breakStartTime: "14:00",
        breakEndTime: "15:00",
        slotDuration: SlotDuration.FortyFive
      },
      {
        dayOfWeek: "Tuesday",
        isWorkingDay: true,
        startTime: "10:00",
        endTime: "18:00",
        breakStartTime: "14:00",
        breakEndTime: "15:00",
        slotDuration: SlotDuration.FortyFive
      },
      {
        dayOfWeek: "Wednesday",
        isWorkingDay: true,
        startTime: "10:00",
        endTime: "18:00",
        breakStartTime: "14:00",
        breakEndTime: "15:00",
        slotDuration: SlotDuration.FortyFive
      },
      {
        dayOfWeek: "Thursday",
        isWorkingDay: true,
        startTime: "10:00",
        endTime: "18:00",
        breakStartTime: "14:00",
        breakEndTime: "15:00",
        slotDuration: SlotDuration.FortyFive
      },
      {
        dayOfWeek: "Friday",
        isWorkingDay: true,
        startTime: "10:00",
        endTime: "18:00",
        breakStartTime: "14:00",
        breakEndTime: "15:00",
        slotDuration: SlotDuration.FortyFive
      },
      {
        dayOfWeek: "Saturday",
        isWorkingDay: false,
        startTime: "09:00",
        endTime: "13:00",
        slotDuration: SlotDuration.FortyFive
      },
      {
        dayOfWeek: "Sunday",
        isWorkingDay: false,
        startTime: "09:00",
        endTime: "13:00",
        slotDuration: SlotDuration.FortyFive
      }
    ],
    bio: "Orthopedic surgeon specializing in sports medicine and joint replacement."
  },
  {
    providerId: "prov-004",
    facilityId: "fac-001",
    title: "Dr.",
    firstName: "David",
    lastName: "Kumar",
    email: "david.kumar@hospital.com",
    phoneNumber: "+1-555-0104",
    specialization: ProviderSpecialization.General,
    licenseNumber: "MD-12348",
    qualification: "MD, MRCGP",
    experience: 8,
    department: "General Medicine",
    status: ProviderStatus.Available,
    isActive: true,
    defaultSlotDuration: SlotDuration.Fifteen,
    consultationFee: 150,
    workingHours: [
      {
        dayOfWeek: "Monday",
        isWorkingDay: true,
        startTime: "07:00",
        endTime: "15:00",
        breakStartTime: "11:00",
        breakEndTime: "12:00",
        slotDuration: SlotDuration.Fifteen
      },
      {
        dayOfWeek: "Tuesday",
        isWorkingDay: true,
        startTime: "07:00",
        endTime: "15:00",
        breakStartTime: "11:00",
        breakEndTime: "12:00",
        slotDuration: SlotDuration.Fifteen
      },
      {
        dayOfWeek: "Wednesday",
        isWorkingDay: true,
        startTime: "07:00",
        endTime: "15:00",
        breakStartTime: "11:00",
        breakEndTime: "12:00",
        slotDuration: SlotDuration.Fifteen
      },
      {
        dayOfWeek: "Thursday",
        isWorkingDay: true,
        startTime: "07:00",
        endTime: "15:00",
        breakStartTime: "11:00",
        breakEndTime: "12:00",
        slotDuration: SlotDuration.Fifteen
      },
      {
        dayOfWeek: "Friday",
        isWorkingDay: true,
        startTime: "07:00",
        endTime: "15:00",
        breakStartTime: "11:00",
        breakEndTime: "12:00",
        slotDuration: SlotDuration.Fifteen
      },
      {
        dayOfWeek: "Saturday",
        isWorkingDay: true,
        startTime: "08:00",
        endTime: "14:00",
        breakStartTime: "11:00",
        breakEndTime: "12:00",
        slotDuration: SlotDuration.Fifteen
      },
      {
        dayOfWeek: "Sunday",
        isWorkingDay: false,
        startTime: "09:00",
        endTime: "13:00",
        slotDuration: SlotDuration.Fifteen
      }
    ],
    bio: "General practitioner with focus on preventive medicine and family health."
  }
];

// Helper function to generate dates
const getDateString = (daysFromToday: number): string => {
  const date = new Date();
  date.setDate(date.getDate() + daysFromToday);
  return date.toISOString().split('T')[0];
};

// Mock Appointments
export const mockAppointments: Appointment[] = [
  {
    appointmentId: "apt-001",
    patientId: "pat-001",
    providerId: "prov-001",
    facilityId: "fac-001",
    appointmentDate: getDateString(0), // Today
    startTime: "09:00",
    endTime: "09:30",
    duration: SlotDuration.Thirty,
    type: AppointmentType.Consultation,
    status: AppointmentStatus.Confirmed,
    priority: AppointmentPriority.Normal,
    title: "Cardiology Consultation",
    description: "Regular check-up for heart condition",
    reason: "Chest pain and shortness of breath",
    notes: "Patient reports improvement since last visit",
    isRecurring: false,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    patient: {
      firstName: "John",
      lastName: "Doe",
      mobileNumber: "+1-555-1001",
      email: "john.doe@email.com"
    },
    provider: {
      firstName: "Sarah",
      lastName: "Johnson",
      specialization: "Cardiology",
      title: "Dr."
    },
    facility: {
      facilityName: "City General Hospital",
      address: "123 Main St, City, State 12345"
    }
  },
  {
    appointmentId: "apt-002",
    patientId: "pat-002",
    providerId: "prov-002",
    facilityId: "fac-001",
    appointmentDate: getDateString(0), // Today
    startTime: "10:30",
    endTime: "11:00",
    duration: SlotDuration.Thirty,
    type: AppointmentType.Checkup,
    status: AppointmentStatus.InProgress,
    priority: AppointmentPriority.Normal,
    title: "Pediatric Check-up",
    description: "Annual wellness visit",
    reason: "Annual check-up for 5-year-old",
    notes: "Vaccination due",
    isRecurring: false,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    patient: {
      firstName: "Emma",
      lastName: "Smith",
      mobileNumber: "+1-555-1002",
      email: "emma.smith@email.com"
    },
    provider: {
      firstName: "Michael",
      lastName: "Chen",
      specialization: "Pediatrics",
      title: "Dr."
    },
    facility: {
      facilityName: "City General Hospital",
      address: "123 Main St, City, State 12345"
    }
  },
  {
    appointmentId: "apt-003",
    patientId: "pat-003",
    providerId: "prov-001",
    facilityId: "fac-001",
    appointmentDate: getDateString(1), // Tomorrow
    startTime: "14:00",
    endTime: "14:30",
    duration: SlotDuration.Thirty,
    type: AppointmentType.FollowUp,
    status: AppointmentStatus.Scheduled,
    priority: AppointmentPriority.High,
    title: "Cardiology Follow-up",
    description: "Post-surgery follow-up",
    reason: "Follow-up after cardiac procedure",
    notes: "Check surgical site and recovery progress",
    isRecurring: false,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    patient: {
      firstName: "Robert",
      lastName: "Wilson",
      mobileNumber: "+1-555-1003",
      email: "robert.wilson@email.com"
    },
    provider: {
      firstName: "Sarah",
      lastName: "Johnson",
      specialization: "Cardiology",
      title: "Dr."
    },
    facility: {
      facilityName: "City General Hospital",
      address: "123 Main St, City, State 12345"
    }
  },
  {
    appointmentId: "apt-004",
    patientId: "pat-004",
    providerId: "prov-003",
    facilityId: "fac-001",
    appointmentDate: getDateString(2), // Day after tomorrow
    startTime: "11:00",
    endTime: "11:45",
    duration: SlotDuration.FortyFive,
    type: AppointmentType.Consultation,
    status: AppointmentStatus.Scheduled,
    priority: AppointmentPriority.Normal,
    title: "Orthopedic Consultation",
    description: "Knee pain evaluation",
    reason: "Chronic knee pain",
    notes: "Patient is an athlete, needs sports medicine evaluation",
    isRecurring: false,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    patient: {
      firstName: "Lisa",
      lastName: "Anderson",
      mobileNumber: "+1-555-1004",
      email: "lisa.anderson@email.com"
    },
    provider: {
      firstName: "Emily",
      lastName: "Rodriguez",
      specialization: "Orthopedics",
      title: "Dr."
    },
    facility: {
      facilityName: "City General Hospital",
      address: "123 Main St, City, State 12345"
    }
  },
  {
    appointmentId: "apt-005",
    patientId: "pat-005",
    providerId: "prov-004",
    facilityId: "fac-001",
    appointmentDate: getDateString(-1), // Yesterday
    startTime: "09:15",
    endTime: "09:30",
    duration: SlotDuration.Fifteen,
    type: AppointmentType.Consultation,
    status: AppointmentStatus.Completed,
    priority: AppointmentPriority.Normal,
    title: "General Consultation",
    description: "Flu symptoms",
    reason: "Cold and flu symptoms",
    notes: "Prescribed medication, follow-up in 1 week if symptoms persist",
    isRecurring: false,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    patient: {
      firstName: "Mark",
      lastName: "Thompson",
      mobileNumber: "+1-555-1005",
      email: "mark.thompson@email.com"
    },
    provider: {
      firstName: "David",
      lastName: "Kumar",
      specialization: "General",
      title: "Dr."
    },
    facility: {
      facilityName: "City General Hospital",
      address: "123 Main St, City, State 12345"
    }
  },
  {
    appointmentId: "apt-006",
    patientId: "pat-006",
    providerId: "prov-002",
    facilityId: "fac-001",
    appointmentDate: getDateString(-2), // 2 days ago
    startTime: "15:00",
    endTime: "15:30",
    duration: SlotDuration.Thirty,
    type: AppointmentType.Vaccination,
    status: AppointmentStatus.NoShow,
    priority: AppointmentPriority.Normal,
    title: "Vaccination Appointment",
    description: "Routine vaccination",
    reason: "Scheduled vaccination for child",
    notes: "Patient did not show up, need to reschedule",
    isRecurring: false,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    patient: {
      firstName: "Sophie",
      lastName: "Brown",
      mobileNumber: "+1-555-1006",
      email: "sophie.brown@email.com"
    },
    provider: {
      firstName: "Michael",
      lastName: "Chen",
      specialization: "Pediatrics",
      title: "Dr."
    },
    facility: {
      facilityName: "City General Hospital",
      address: "123 Main St, City, State 12345"
    }
  }
];

// Mock Appointment Statistics
export const mockAppointmentStats: AppointmentStats = {
  totalAppointments: 156,
  todayAppointments: 8,
  upcomingAppointments: 23,
  completedAppointments: 98,
  cancelledAppointments: 12,
  noShowAppointments: 5,
  statusBreakdown: {
    [AppointmentStatus.Scheduled]: 15,
    [AppointmentStatus.Confirmed]: 8,
    [AppointmentStatus.InProgress]: 2,
    [AppointmentStatus.Completed]: 98,
    [AppointmentStatus.Cancelled]: 12,
    [AppointmentStatus.NoShow]: 5,
    [AppointmentStatus.Rescheduled]: 16
  },
  typeBreakdown: {
    [AppointmentType.Consultation]: 89,
    [AppointmentType.FollowUp]: 34,
    [AppointmentType.Emergency]: 3,
    [AppointmentType.Procedure]: 8,
    [AppointmentType.Surgery]: 2,
    [AppointmentType.Diagnostic]: 12,
    [AppointmentType.Vaccination]: 6,
    [AppointmentType.Checkup]: 2
  }
};

// Mock Time Slots for today
export const mockTimeSlots: TimeSlot[] = [
  { startTime: "09:00", endTime: "09:30", isAvailable: false, appointmentId: "apt-001" },
  { startTime: "09:30", endTime: "10:00", isAvailable: true },
  { startTime: "10:00", endTime: "10:30", isAvailable: true },
  { startTime: "10:30", endTime: "11:00", isAvailable: false, appointmentId: "apt-002" },
  { startTime: "11:00", endTime: "11:30", isAvailable: true },
  { startTime: "11:30", endTime: "12:00", isAvailable: true },
  { startTime: "12:00", endTime: "12:30", isAvailable: true },
  { startTime: "12:30", endTime: "13:00", isAvailable: true },
  { startTime: "13:00", endTime: "13:30", isAvailable: false, isBlocked: true, blockReason: "Lunch Break" },
  { startTime: "13:30", endTime: "14:00", isAvailable: false, isBlocked: true, blockReason: "Lunch Break" },
  { startTime: "14:00", endTime: "14:30", isAvailable: true },
  { startTime: "14:30", endTime: "15:00", isAvailable: true },
  { startTime: "15:00", endTime: "15:30", isAvailable: true },
  { startTime: "15:30", endTime: "16:00", isAvailable: true },
  { startTime: "16:00", endTime: "16:30", isAvailable: true },
  { startTime: "16:30", endTime: "17:00", isAvailable: true }
];

// Mock Provider Schedule
export const mockProviderSchedule: ProviderSchedule = {
  providerId: "prov-001",
  date: getDateString(0),
  timeSlots: mockTimeSlots,
  workingHours: {
    startTime: "09:00",
    endTime: "17:00"
  },
  isWorkingDay: true,
  specialNotes: "Regular consultation hours"
};

// Mock Notifications
export const mockNotifications: Notification[] = [
  {
    notificationId: "notif-001",
    appointmentId: "apt-001",
    patientId: "pat-001",
    providerId: "prov-001",
    facilityId: "fac-001",
    type: NotificationType.SMS,
    status: NotificationStatus.Delivered,
    title: "Appointment Confirmation",
    message: "Your appointment with Dr. Sarah Johnson is confirmed for today at 9:00 AM.",
    recipientName: "John Doe",
    recipientPhone: "+1-555-1001",
    scheduledAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(), // 2 hours ago
    sentAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
    deliveredAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
    createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
    createdBy: "system"
  },
  {
    notificationId: "notif-002",
    appointmentId: "apt-003",
    patientId: "pat-003",
    providerId: "prov-001",
    facilityId: "fac-001",
    type: NotificationType.Email,
    status: NotificationStatus.Sent,
    title: "Appointment Reminder",
    message: "This is a reminder for your appointment with Dr. Sarah Johnson tomorrow at 2:00 PM.",
    recipientName: "Robert Wilson",
    recipientEmail: "robert.wilson@email.com",
    scheduledAt: new Date(Date.now() - 30 * 60 * 1000).toISOString(), // 30 minutes ago
    sentAt: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
    createdAt: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
    createdBy: "system"
  },
  {
    notificationId: "notif-003",
    appointmentId: "apt-006",
    patientId: "pat-006",
    providerId: "prov-002",
    facilityId: "fac-001",
    type: NotificationType.SMS,
    status: NotificationStatus.Failed,
    title: "Appointment Reminder",
    message: "Reminder: Your child's vaccination appointment is today at 3:00 PM.",
    recipientName: "Sophie Brown",
    recipientPhone: "+1-555-1006",
    scheduledAt: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(), // 4 hours ago
    errorMessage: "Invalid phone number",
    failureReason: "Phone number not reachable",
    retryCount: 2,
    maxRetries: 3,
    createdAt: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(),
    createdBy: "system"
  }
];

// Mock Audit Trails
export const mockAuditTrails: AuditTrail[] = [
  {
    auditId: "audit-001",
    entityType: "appointment",
    entityId: "apt-001",
    action: AuditAction.Create,
    newValues: {
      patientId: "pat-001",
      providerId: "prov-001",
      appointmentDate: getDateString(0),
      startTime: "09:00",
      status: AppointmentStatus.Scheduled
    },
    description: "Appointment created for patient John Doe",
    timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(), // 1 day ago
    performedBy: "user-001",
    performedByName: "Dr. Sarah Johnson",
    ipAddress: "192.168.1.100",
    userAgent: "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
    facilityId: "fac-001"
  },
  {
    auditId: "audit-002",
    entityType: "appointment",
    entityId: "apt-001",
    action: AuditAction.Update,
    oldValues: {
      status: AppointmentStatus.Scheduled
    },
    newValues: {
      status: AppointmentStatus.Confirmed
    },
    changes: ["status"],
    description: "Appointment status updated to Confirmed",
    timestamp: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString(), // 12 hours ago
    performedBy: "user-002",
    performedByName: "Nurse Mary",
    ipAddress: "192.168.1.101",
    userAgent: "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
    facilityId: "fac-001"
  },
  {
    auditId: "audit-003",
    entityType: "appointment",
    entityId: "apt-005",
    action: AuditAction.Complete,
    description: "Appointment completed. Notes: Prescribed medication, follow-up in 1 week if symptoms persist",
    timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(), // 1 day ago
    performedBy: "prov-004",
    performedByName: "Dr. David Kumar",
    ipAddress: "192.168.1.102",
    userAgent: "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
    facilityId: "fac-001"
  },
  {
    auditId: "audit-004",
    entityType: "provider",
    entityId: "prov-001",
    action: AuditAction.View,
    description: "Provider schedule viewed for date: " + getDateString(0),
    timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(), // 2 hours ago
    performedBy: "user-003",
    performedByName: "Admin User",
    ipAddress: "192.168.1.103",
    userAgent: "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
    facilityId: "fac-001"
  }
];

// Mock Patients (for dropdown selections)
export const mockPatients = [
  {
    patientId: "pat-001",
    firstName: "John",
    lastName: "Doe",
    identifierNumber: "ID-001",
    mobileNumber: "+1-555-1001",
    email: "john.doe@email.com"
  },
  {
    patientId: "pat-002",
    firstName: "Emma",
    lastName: "Smith",
    identifierNumber: "ID-002",
    mobileNumber: "+1-555-1002",
    email: "emma.smith@email.com"
  },
  {
    patientId: "pat-003",
    firstName: "Robert",
    lastName: "Wilson",
    identifierNumber: "ID-003",
    mobileNumber: "+1-555-1003",
    email: "robert.wilson@email.com"
  },
  {
    patientId: "pat-004",
    firstName: "Lisa",
    lastName: "Anderson",
    identifierNumber: "ID-004",
    mobileNumber: "+1-555-1004",
    email: "lisa.anderson@email.com"
  },
  {
    patientId: "pat-005",
    firstName: "Mark",
    lastName: "Thompson",
    identifierNumber: "ID-005",
    mobileNumber: "+1-555-1005",
    email: "mark.thompson@email.com"
  },
  {
    patientId: "pat-006",
    firstName: "Sophie",
    lastName: "Brown",
    identifierNumber: "ID-006",
    mobileNumber: "+1-555-1006",
    email: "sophie.brown@email.com"
  }
];

// Helper function to generate more appointments for testing
export const generateMoreAppointments = (count: number): Appointment[] => {
  const appointments: Appointment[] = [];
  const statuses = Object.values(AppointmentStatus);
  const types = Object.values(AppointmentType);
  const priorities = Object.values(AppointmentPriority);

  for (let i = 0; i < count; i++) {
    const dayOffset = Math.floor(Math.random() * 30) - 15; // Random day within ±15 days
    const hour = Math.floor(Math.random() * 8) + 9; // 9 AM to 5 PM
    const minute = Math.random() < 0.5 ? 0 : 30; // Either :00 or :30
    const randomPatient = mockPatients[Math.floor(Math.random() * mockPatients.length)];
    const randomProvider = mockProviders[Math.floor(Math.random() * mockProviders.length)];

    appointments.push({
      appointmentId: `apt-${String(i + 100).padStart(3, '0')}`,
      patientId: randomPatient.patientId,
      providerId: randomProvider.providerId,
      facilityId: "fac-001",
      appointmentDate: getDateString(dayOffset),
      startTime: `${String(hour).padStart(2, '0')}:${String(minute).padStart(2, '0')}`,
      endTime: `${String(hour).padStart(2, '0')}:${String(minute + 30).padStart(2, '0')}`,
      duration: SlotDuration.Thirty,
      type: types[Math.floor(Math.random() * types.length)],
      status: statuses[Math.floor(Math.random() * statuses.length)],
      priority: priorities[Math.floor(Math.random() * priorities.length)],
      title: `${types[Math.floor(Math.random() * types.length)]} Appointment`,
      description: "Generated test appointment",
      reason: "Test appointment for demonstration",
      isRecurring: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      patient: {
        firstName: randomPatient.firstName,
        lastName: randomPatient.lastName,
        mobileNumber: randomPatient.mobileNumber,
        email: randomPatient.email
      },
      provider: {
        firstName: randomProvider.firstName,
        lastName: randomProvider.lastName,
        specialization: randomProvider.specialization,
        title: randomProvider.title
      },
      facility: {
        facilityName: "City General Hospital",
        address: "123 Main St, City, State 12345"
      }
    });
  }

  return appointments;
};
