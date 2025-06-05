import { AppointmentStatus, AppointmentType, AppointmentPriority } from "../types/appointmentenums";
import type { Appointment, TimeSlot } from "../types/appointment";

// Format appointment time for display
export const formatAppointmentTime = (startTime: string, endTime: string): string => {
  return `${startTime} - ${endTime}`;
};

// Format appointment date for display
export const formatAppointmentDate = (date: string): string => {
  return new Date(date).toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
};

// Get appointment status color for UI
export const getAppointmentStatusColor = (status: AppointmentStatus): string => {
  switch (status) {
    case AppointmentStatus.Scheduled:
      return 'bg-blue-100 text-blue-800 border-blue-200';
    case AppointmentStatus.Confirmed:
      return 'bg-green-100 text-green-800 border-green-200';
    case AppointmentStatus.InProgress:
      return 'bg-yellow-100 text-yellow-800 border-yellow-200';
    case AppointmentStatus.Completed:
      return 'bg-gray-100 text-gray-800 border-gray-200';
    case AppointmentStatus.Cancelled:
      return 'bg-red-100 text-red-800 border-red-200';
    case AppointmentStatus.NoShow:
      return 'bg-red-100 text-red-800 border-red-200';
    case AppointmentStatus.Rescheduled:
      return 'bg-purple-100 text-purple-800 border-purple-200';
    default:
      return 'bg-gray-100 text-gray-800 border-gray-200';
  }
};

// Get appointment priority color for UI
export const getAppointmentPriorityColor = (priority: AppointmentPriority): string => {
  switch (priority) {
    case AppointmentPriority.Low:
      return 'bg-gray-100 text-gray-800';
    case AppointmentPriority.Normal:
      return 'bg-blue-100 text-blue-800';
    case AppointmentPriority.High:
      return 'bg-orange-100 text-orange-800';
    case AppointmentPriority.Urgent:
      return 'bg-red-100 text-red-800';
    case AppointmentPriority.Emergency:
      return 'bg-red-200 text-red-900';
    default:
      return 'bg-gray-100 text-gray-800';
  }
};

// Check if appointment is today
export const isAppointmentToday = (appointmentDate: string): boolean => {
  const today = new Date().toISOString().split('T')[0];
  return appointmentDate === today;
};

// Check if appointment is in the past
export const isAppointmentPast = (appointmentDate: string, startTime: string): boolean => {
  const appointmentDateTime = new Date(`${appointmentDate}T${startTime}`);
  return appointmentDateTime < new Date();
};

// Check if appointment is upcoming (within next 7 days)
export const isAppointmentUpcoming = (appointmentDate: string): boolean => {
  const today = new Date();
  const appointmentDateObj = new Date(appointmentDate);
  const diffTime = appointmentDateObj.getTime() - today.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return diffDays >= 0 && diffDays <= 7;
};

// Calculate appointment duration in minutes
export const calculateAppointmentDuration = (startTime: string, endTime: string): number => {
  const [startHour, startMin] = startTime.split(':').map(Number);
  const [endHour, endMin] = endTime.split(':').map(Number);
  const startMinutes = startHour * 60 + startMin;
  const endMinutes = endHour * 60 + endMin;
  return endMinutes - startMinutes;
};

// Generate time slots for a given time range
export const generateTimeSlots = (
  startTime: string,
  endTime: string,
  slotDuration: number,
  existingAppointments: Appointment[] = []
): TimeSlot[] => {
  const slots: TimeSlot[] = [];
  const [startHour, startMin] = startTime.split(':').map(Number);
  const [endHour, endMin] = endTime.split(':').map(Number);
  
  let currentMinutes = startHour * 60 + startMin;
  const endMinutes = endHour * 60 + endMin;

  while (currentMinutes < endMinutes) {
    const slotStartHour = Math.floor(currentMinutes / 60);
    const slotStartMin = currentMinutes % 60;
    const slotEndMinutes = currentMinutes + slotDuration;
    const slotEndHour = Math.floor(slotEndMinutes / 60);
    const slotEndMin = slotEndMinutes % 60;

    const slotStartTime = `${slotStartHour.toString().padStart(2, '0')}:${slotStartMin.toString().padStart(2, '0')}`;
    const slotEndTime = `${slotEndHour.toString().padStart(2, '0')}:${slotEndMin.toString().padStart(2, '0')}`;

    // Check if slot is available (no existing appointment)
    const isAvailable = !existingAppointments.some(appointment => {
      const appointmentStart = appointment.startTime;
      const appointmentEnd = appointment.endTime;
      return (
        (slotStartTime >= appointmentStart && slotStartTime < appointmentEnd) ||
        (slotEndTime > appointmentStart && slotEndTime <= appointmentEnd) ||
        (slotStartTime <= appointmentStart && slotEndTime >= appointmentEnd)
      );
    });

    slots.push({
      startTime: slotStartTime,
      endTime: slotEndTime,
      isAvailable
    });

    currentMinutes += slotDuration;
  }

  return slots;
};

// Filter appointments by status
export const filterAppointmentsByStatus = (
  appointments: Appointment[],
  statuses: AppointmentStatus[]
): Appointment[] => {
  return appointments.filter(appointment => statuses.includes(appointment.status));
};

// Filter appointments by date range
export const filterAppointmentsByDateRange = (
  appointments: Appointment[],
  startDate: string,
  endDate: string
): Appointment[] => {
  return appointments.filter(appointment => {
    const appointmentDate = appointment.appointmentDate;
    return appointmentDate >= startDate && appointmentDate <= endDate;
  });
};

// Sort appointments by date and time
export const sortAppointmentsByDateTime = (appointments: Appointment[]): Appointment[] => {
  return [...appointments].sort((a, b) => {
    const dateComparison = a.appointmentDate.localeCompare(b.appointmentDate);
    if (dateComparison !== 0) return dateComparison;
    return a.startTime.localeCompare(b.startTime);
  });
};

// Group appointments by date
export const groupAppointmentsByDate = (appointments: Appointment[]): Record<string, Appointment[]> => {
  return appointments.reduce((groups, appointment) => {
    const date = appointment.appointmentDate;
    if (!groups[date]) {
      groups[date] = [];
    }
    groups[date].push(appointment);
    return groups;
  }, {} as Record<string, Appointment[]>);
};

// Get appointment conflicts for a given time slot
export const getAppointmentConflicts = (
  appointments: Appointment[],
  date: string,
  startTime: string,
  endTime: string,
  excludeAppointmentId?: string
): Appointment[] => {
  return appointments.filter(appointment => {
    if (appointment.appointmentId === excludeAppointmentId) return false;
    if (appointment.appointmentDate !== date) return false;
    
    const appointmentStart = appointment.startTime;
    const appointmentEnd = appointment.endTime;
    
    return (
      (startTime >= appointmentStart && startTime < appointmentEnd) ||
      (endTime > appointmentStart && endTime <= appointmentEnd) ||
      (startTime <= appointmentStart && endTime >= appointmentEnd)
    );
  });
};

// Validate appointment time slot
export const validateAppointmentTimeSlot = (
  startTime: string,
  endTime: string,
  workingStartTime: string,
  workingEndTime: string
): { isValid: boolean; error?: string } => {
  // Check if start time is before end time
  if (startTime >= endTime) {
    return { isValid: false, error: "Start time must be before end time" };
  }

  // Check if appointment is within working hours
  if (startTime < workingStartTime || endTime > workingEndTime) {
    return { 
      isValid: false, 
      error: `Appointment must be within working hours (${workingStartTime} - ${workingEndTime})` 
    };
  }

  return { isValid: true };
};

// Calculate next available slot for a provider
export const getNextAvailableSlot = (
  timeSlots: TimeSlot[],
  preferredDuration: number = 30
): TimeSlot | null => {
  const availableSlots = timeSlots.filter(slot => slot.isAvailable);
  
  if (availableSlots.length === 0) return null;

  // Find the first available slot that meets the duration requirement
  for (const slot of availableSlots) {
    const slotDuration = calculateAppointmentDuration(slot.startTime, slot.endTime);
    if (slotDuration >= preferredDuration) {
      return slot;
    }
  }

  // If no slot meets the duration, return the first available slot
  return availableSlots[0];
};

// Format appointment for display in lists
export const formatAppointmentForDisplay = (appointment: Appointment): string => {
  const patientName = appointment.patient 
    ? `${appointment.patient.firstName} ${appointment.patient.lastName}`
    : 'Unknown Patient';
  
  const time = formatAppointmentTime(appointment.startTime, appointment.endTime);
  const date = formatAppointmentDate(appointment.appointmentDate);
  
  return `${patientName} - ${date} at ${time}`;
};

// Check if appointment can be cancelled
export const canCancelAppointment = (appointment: Appointment): boolean => {
  const cancellableStatuses = [
    AppointmentStatus.Scheduled,
    AppointmentStatus.Confirmed
  ];
  
  return cancellableStatuses.includes(appointment.status) && 
         !isAppointmentPast(appointment.appointmentDate, appointment.startTime);
};

// Check if appointment can be rescheduled
export const canRescheduleAppointment = (appointment: Appointment): boolean => {
  const reschedulableStatuses = [
    AppointmentStatus.Scheduled,
    AppointmentStatus.Confirmed
  ];
  
  return reschedulableStatuses.includes(appointment.status) && 
         !isAppointmentPast(appointment.appointmentDate, appointment.startTime);
};

// Check if appointment can be completed
export const canCompleteAppointment = (appointment: Appointment): boolean => {
  const completableStatuses = [
    AppointmentStatus.Confirmed,
    AppointmentStatus.InProgress
  ];
  
  return completableStatuses.includes(appointment.status);
};
