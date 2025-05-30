import { mockProviders, mockPatients, mockAppointments } from './mockData';

// Mock delay to simulate network request
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

// Provider APIs
export const getProviders = async () => {
  await delay(500);
  return { success: true, data: mockProviders };
};

export const getProviderById = async (providerId) => {
  await delay(300);
  const provider = mockProviders.find(p => p.id === providerId);
  if (provider) {
    return { success: true, data: provider };
  }
  return { success: false, error: "Provider not found" };
};

export const getProviderAvailability = async (providerId, startDate, endDate) => {
  await delay(300);
  const provider = mockProviders.find(p => p.id === providerId);
  if (!provider) {
    return { success: false, error: "Provider not found" };
  }
  
  // Generate random availability slots
  const slots = [];
  const start = new Date(startDate || new Date());
  const end = new Date(endDate || new Date(start.getTime() + 7 * 24 * 60 * 60 * 1000));
  
  for (let day = new Date(start); day <= end; day.setDate(day.getDate() + 1)) {
    // Skip weekends
    if (day.getDay() === 0 || day.getDay() === 6) continue;
    
    // 9 AM to 5 PM slots
    for (let hour = 9; hour < 17; hour++) {
      // 30-minute slots
      for (let minute of [0, 30]) {
        const slotStart = new Date(day);
        slotStart.setHours(hour, minute, 0, 0);
        
        const slotEnd = new Date(slotStart);
        slotEnd.setMinutes(slotEnd.getMinutes() + 30);
        
        // 70% chance of availability
        if (Math.random() > 0.3) {
          slots.push({
            start: slotStart,
            end: slotEnd,
            available: true
          });
        }
      }
    }
  }
  
  return { success: true, data: slots };
};

// Appointment APIs
export const getAppointments = async (providerId, startDate, endDate) => {
  await delay(500);
  let filtered = [...mockAppointments];
  
  if (providerId) {
    filtered = filtered.filter(apt => apt.providerId === providerId);
  }
  
  if (startDate) {
    const start = new Date(startDate);
    filtered = filtered.filter(apt => new Date(apt.startTime) >= start);
  }
  
  if (endDate) {
    const end = new Date(endDate);
    filtered = filtered.filter(apt => new Date(apt.startTime) <= end);
  }
  
  return { success: true, data: filtered };
};

export const getAppointmentById = async (appointmentId) => {
  await delay(300);
  const appointment = mockAppointments.find(apt => apt.id === appointmentId);
  if (appointment) {
    return { success: true, data: appointment };
  }
  return { success: false, error: "Appointment not found" };
};

export const createAppointment = async (appointmentData) => {
  await delay(600);
  const newAppointment = {
    id: `apt${mockAppointments.length + 1}`,
    ...appointmentData,
    startTime: new Date(appointmentData.startTime),
    endTime: new Date(appointmentData.endTime)
  };
  
  mockAppointments.push(newAppointment);
  return { success: true, data: newAppointment };
};

export const updateAppointment = async (appointmentId, appointmentData) => {
  await delay(600);
  const index = mockAppointments.findIndex(apt => apt.id === appointmentId);
  
  if (index === -1) {
    return { success: false, error: "Appointment not found" };
  }
  
  mockAppointments[index] = {
    ...mockAppointments[index],
    ...appointmentData,
    startTime: new Date(appointmentData.startTime),
    endTime: new Date(appointmentData.endTime)
  };
  
  return { success: true, data: mockAppointments[index] };
};

export const cancelAppointment = async (appointmentId, reason) => {
  await delay(400);
  const index = mockAppointments.findIndex(apt => apt.id === appointmentId);
  
  if (index === -1) {
    return { success: false, error: "Appointment not found" };
  }
  
  mockAppointments[index].status = "Cancelled";
  mockAppointments[index].cancellationReason = reason;
  
  return { success: true, data: mockAppointments[index] };
};

// Patient APIs
export const searchPatients = async (query) => {
  await delay(300);
  if (!query || query.length < 2) {
    return { success: true, data: [] };
  }
  
  const filtered = mockPatients.filter(patient => 
    patient.firstName.toLowerCase().includes(query.toLowerCase()) ||
    patient.lastName.toLowerCase().includes(query.toLowerCase()) ||
    patient.email.toLowerCase().includes(query.toLowerCase()) ||
    patient.phone.includes(query)
  );
  
  return { success: true, data: filtered };
};

// Notification APIs
export const sendNotification = async (notificationData) => {
  await delay(300);
  console.log("Notification sent:", notificationData);
  return { success: true, data: { id: `notif-${Date.now()}`, ...notificationData, sentAt: new Date() } };
};