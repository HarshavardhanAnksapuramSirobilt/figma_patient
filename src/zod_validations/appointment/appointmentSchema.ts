import { z } from "zod";
import {
  AppointmentStatus,
  AppointmentType,
  AppointmentPriority,
  RecurringPattern,
  SlotDuration
} from "../../types/appointmentenums";

// Helper validation functions
const requiredString = (message: string) =>
  z.string()
    .min(1, { message })
    .transform((val) => val.trim());

const requiredEnum = <T extends Record<string, string | number>>(
  enumObject: T,
  message: string
) =>
  z.nativeEnum(enumObject, { 
    errorMap: () => ({ message }) 
  });

const optionalString = () =>
  z.string()
    .optional()
    .transform((val) => val?.trim() || undefined);

const dateString = (message: string) =>
  z.string()
    .min(1, { message })
    .refine((val) => {
      const date = new Date(val);
      return !isNaN(date.getTime());
    }, { message: "Invalid date format" });

const timeString = (message: string) =>
  z.string()
    .min(1, { message })
    .refine((val) => {
      const timeRegex = /^([01]?[0-9]|2[0-3]):[0-5][0-9]$/;
      return timeRegex.test(val);
    }, { message: "Time must be in HH:MM format" });

const futureDate = (message: string) =>
  z.string()
    .min(1, { message })
    .refine((val) => {
      const date = new Date(val);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      return date >= today;
    }, { message: "Date must be today or in the future" });

// Core appointment validation schema
export const appointmentSchema = z.object({
  patientId: requiredString("Patient is required"),
  providerId: requiredString("Provider is required"),
  facilityId: requiredString("Facility is required"),
  
  appointmentDate: futureDate("Appointment date is required and must be today or in the future"),
  startTime: timeString("Start time is required and must be in HH:MM format"),
  endTime: timeString("End time is required and must be in HH:MM format"),
  duration: requiredEnum(SlotDuration, "Duration is required"),
  
  type: requiredEnum(AppointmentType, "Appointment type is required"),
  priority: requiredEnum(AppointmentPriority, "Priority is required"),
  
  title: optionalString(),
  description: optionalString(),
  notes: optionalString(),
  reason: optionalString(),
  
  isRecurring: z.boolean().optional().default(false),
  recurringPattern: z.nativeEnum(RecurringPattern).optional(),
  recurringEndDate: z.string().optional()
}).refine((data) => {
  // Validate that end time is after start time
  const [startHour, startMin] = data.startTime.split(':').map(Number);
  const [endHour, endMin] = data.endTime.split(':').map(Number);
  const startMinutes = startHour * 60 + startMin;
  const endMinutes = endHour * 60 + endMin;
  return endMinutes > startMinutes;
}, {
  message: "End time must be after start time",
  path: ["endTime"]
}).refine((data) => {
  // Validate recurring pattern if isRecurring is true
  if (data.isRecurring && !data.recurringPattern) {
    return false;
  }
  return true;
}, {
  message: "Recurring pattern is required when appointment is recurring",
  path: ["recurringPattern"]
}).refine((data) => {
  // Validate recurring end date if isRecurring is true
  if (data.isRecurring && data.recurringPattern !== RecurringPattern.None) {
    if (!data.recurringEndDate) return false;
    const endDate = new Date(data.recurringEndDate);
    const startDate = new Date(data.appointmentDate);
    return endDate > startDate;
  }
  return true;
}, {
  message: "Recurring end date is required and must be after appointment date",
  path: ["recurringEndDate"]
});

// Update appointment schema (allows partial updates)
export const updateAppointmentSchema = z.object({
  patientId: z.string().optional(),
  providerId: z.string().optional(),
  facilityId: z.string().optional(),

  appointmentDate: z.string().optional(),
  startTime: z.string().optional(),
  endTime: z.string().optional(),
  duration: z.nativeEnum(SlotDuration).optional(),

  type: z.nativeEnum(AppointmentType).optional(),
  priority: z.nativeEnum(AppointmentPriority).optional(),
  status: z.nativeEnum(AppointmentStatus).optional(),

  title: optionalString(),
  description: optionalString(),
  notes: optionalString(),
  reason: optionalString(),

  isRecurring: z.boolean().optional(),
  recurringPattern: z.nativeEnum(RecurringPattern).optional(),
  recurringEndDate: z.string().optional()
});

// Appointment filter schema
export const appointmentFilterSchema = z.object({
  patientId: z.string().optional(),
  providerId: z.string().optional(),
  facilityId: z.string().optional(),
  status: z.array(z.nativeEnum(AppointmentStatus)).optional(),
  type: z.array(z.nativeEnum(AppointmentType)).optional(),
  priority: z.array(z.nativeEnum(AppointmentPriority)).optional(),
  dateFrom: z.string().optional(),
  dateTo: z.string().optional(),
  searchTerm: z.string().optional(),
  page: z.number().min(0).optional(),
  size: z.number().min(1).max(100).optional()
});

// Reschedule appointment schema
export const rescheduleAppointmentSchema = z.object({
  appointmentDate: futureDate("New appointment date is required"),
  startTime: timeString("New start time is required"),
  endTime: timeString("New end time is required"),
  reason: optionalString()
}).refine((data) => {
  // Validate that end time is after start time
  const [startHour, startMin] = data.startTime.split(':').map(Number);
  const [endHour, endMin] = data.endTime.split(':').map(Number);
  const startMinutes = startHour * 60 + startMin;
  const endMinutes = endHour * 60 + endMin;
  return endMinutes > startMinutes;
}, {
  message: "End time must be after start time",
  path: ["endTime"]
});

// Cancel appointment schema
export const cancelAppointmentSchema = z.object({
  reason: z.string().min(1, "Cancellation reason is required")
});

// Complete appointment schema
export const completeAppointmentSchema = z.object({
  notes: optionalString()
});

// Time slot validation
export const timeSlotSchema = z.object({
  startTime: timeString("Start time is required"),
  endTime: timeString("End time is required"),
  isAvailable: z.boolean(),
  appointmentId: z.string().optional(),
  isBlocked: z.boolean().optional(),
  blockReason: optionalString()
});

// Provider schedule validation
export const providerScheduleSchema = z.object({
  providerId: requiredString("Provider ID is required"),
  date: dateString("Date is required"),
  timeSlots: z.array(timeSlotSchema),
  workingHours: z.object({
    startTime: timeString("Working start time is required"),
    endTime: timeString("Working end time is required")
  }),
  isWorkingDay: z.boolean(),
  specialNotes: optionalString()
});

// Bulk appointment operations
export const bulkAppointmentSchema = z.object({
  appointmentIds: z.array(z.string()).min(1, "At least one appointment ID is required"),
  action: z.enum(['cancel', 'confirm', 'complete']),
  reason: optionalString(),
  notes: optionalString()
});

// Export type inference
export type AppointmentFormData = z.infer<typeof appointmentSchema>;
export type UpdateAppointmentFormData = z.infer<typeof updateAppointmentSchema>;
export type AppointmentFilterData = z.infer<typeof appointmentFilterSchema>;
export type RescheduleAppointmentData = z.infer<typeof rescheduleAppointmentSchema>;
export type CancelAppointmentData = z.infer<typeof cancelAppointmentSchema>;
export type CompleteAppointmentData = z.infer<typeof completeAppointmentSchema>;
export type TimeSlotData = z.infer<typeof timeSlotSchema>;
export type ProviderScheduleData = z.infer<typeof providerScheduleSchema>;
export type BulkAppointmentData = z.infer<typeof bulkAppointmentSchema>;
