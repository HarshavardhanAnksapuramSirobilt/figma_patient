// Appointment Status
export enum AppointmentStatus {
  Scheduled = "Scheduled",
  Confirmed = "Confirmed", 
  InProgress = "InProgress",
  Completed = "Completed",
  Cancelled = "Cancelled",
  NoShow = "NoShow",
  Rescheduled = "Rescheduled"
}

// Appointment Type
export enum AppointmentType {
  Consultation = "Consultation",
  FollowUp = "FollowUp",
  Emergency = "Emergency",
  Procedure = "Procedure",
  Surgery = "Surgery",
  Diagnostic = "Diagnostic",
  Vaccination = "Vaccination",
  Checkup = "Checkup"
}

// Appointment Priority
export enum AppointmentPriority {
  Low = "Low",
  Normal = "Normal",
  High = "High",
  Urgent = "Urgent",
  Emergency = "Emergency"
}

// Notification Type
export enum NotificationType {
  SMS = "SMS",
  Email = "Email",
  WhatsApp = "WhatsApp",
  Push = "Push",
  Call = "Call"
}

// Notification Status
export enum NotificationStatus {
  Pending = "Pending",
  Sent = "Sent",
  Delivered = "Delivered",
  Failed = "Failed",
  Read = "Read"
}

// Provider Specialization
export enum ProviderSpecialization {
  Cardiology = "Cardiology",
  Pediatrics = "Pediatrics",
  Emergency = "Emergency",
  General = "General",
  Orthopedics = "Orthopedics",
  Neurology = "Neurology",
  Dermatology = "Dermatology",
  Psychiatry = "Psychiatry",
  Gynecology = "Gynecology",
  Oncology = "Oncology",
  Radiology = "Radiology",
  Pathology = "Pathology"
}

// Provider Status
export enum ProviderStatus {
  Active = "Active",
  Inactive = "Inactive",
  OnLeave = "OnLeave",
  Busy = "Busy",
  Available = "Available"
}

// Audit Action
export enum AuditAction {
  Create = "Create",
  Update = "Update",
  Delete = "Delete",
  View = "View",
  Cancel = "Cancel",
  Reschedule = "Reschedule",
  Confirm = "Confirm",
  Complete = "Complete"
}

// Time Slot Duration (in minutes)
export enum SlotDuration {
  Fifteen = 15,
  Thirty = 30,
  FortyFive = 45,
  Sixty = 60,
  Ninety = 90,
  TwoHours = 120
}

// Days of Week
export enum DayOfWeek {
  Monday = "Monday",
  Tuesday = "Tuesday", 
  Wednesday = "Wednesday",
  Thursday = "Thursday",
  Friday = "Friday",
  Saturday = "Saturday",
  Sunday = "Sunday"
}

// Recurring Pattern
export enum RecurringPattern {
  None = "None",
  Daily = "Daily",
  Weekly = "Weekly",
  Monthly = "Monthly",
  Yearly = "Yearly"
}

// Options for dropdowns
export const appointmentStatusOptions = Object.values(AppointmentStatus);
export const appointmentTypeOptions = Object.values(AppointmentType);
export const appointmentPriorityOptions = Object.values(AppointmentPriority);
export const notificationTypeOptions = Object.values(NotificationType);
export const notificationStatusOptions = Object.values(NotificationStatus);
export const providerSpecializationOptions = Object.values(ProviderSpecialization);
export const providerStatusOptions = Object.values(ProviderStatus);
export const auditActionOptions = Object.values(AuditAction);
export const slotDurationOptions = Object.values(SlotDuration);
export const dayOfWeekOptions = Object.values(DayOfWeek);
export const recurringPatternOptions = Object.values(RecurringPattern);
