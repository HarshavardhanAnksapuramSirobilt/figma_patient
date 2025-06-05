import axios from "axios";
import type { 
  Notification,
  NotificationTemplate,
  NotificationPreferences,
  NotificationFilters,
  NotificationStats,
  BulkNotificationRequest,
  NotificationAudit
} from '../types/notification';

const BASE_URL = "https://megha-dev.sirobilt.com/api";

// Send a notification
export const sendNotification = async (notification: Omit<Notification, 'notificationId'>) => {
  try {
    console.log("Sending notification:", notification);
    const response = await axios.post(`${BASE_URL}/notifications/send`, notification);
    return { success: true, data: response.data };
  } catch (error: any) {
    console.error("Send Notification Error:", error.response?.data || error.message);
    return { success: false, error: error.response?.data || error.message };
  }
};

// Send bulk notifications
export const sendBulkNotifications = async (request: BulkNotificationRequest) => {
  try {
    const response = await axios.post(`${BASE_URL}/notifications/bulk-send`, request);
    return { success: true, data: response.data };
  } catch (error: any) {
    console.error("Bulk Notification Error:", error.response?.data || error.message);
    return { success: false, error: error.response?.data || error.message };
  }
};

// Get notifications with filters
export const getNotifications = async (filters: NotificationFilters = {}) => {
  try {
    const params = new URLSearchParams();
    
    // Add filter parameters
    if (filters.appointmentId) params.append('appointmentId', filters.appointmentId);
    if (filters.patientId) params.append('patientId', filters.patientId);
    if (filters.providerId) params.append('providerId', filters.providerId);
    if (filters.facilityId) params.append('facilityId', filters.facilityId);
    if (filters.type?.length) params.append('type', filters.type.join(','));
    if (filters.status?.length) params.append('status', filters.status.join(','));
    if (filters.dateFrom) params.append('dateFrom', filters.dateFrom);
    if (filters.dateTo) params.append('dateTo', filters.dateTo);
    if (filters.searchTerm) params.append('search', filters.searchTerm);
    if (filters.page !== undefined) params.append('page', filters.page.toString());
    if (filters.size !== undefined) params.append('size', filters.size.toString());

    const response = await axios.get(`${BASE_URL}/notifications?${params}`);
    return response.data;
  } catch (error: any) {
    console.error("Failed to fetch notifications:", error);
    return { results: [], totalElements: 0, totalPages: 0 };
  }
};

// Get notification by ID
export const getNotificationById = async (id: string): Promise<Notification> => {
  try {
    const response = await axios.get(`${BASE_URL}/notifications/${id}`);
    return response.data;
  } catch (error: any) {
    console.error("Fetch Notification Error:", error);
    throw new Error("Failed to fetch notification data");
  }
};

// Update notification status
export const updateNotificationStatus = async (id: string, status: string) => {
  try {
    const response = await axios.patch(`${BASE_URL}/notifications/${id}/status`, { status });
    return { success: true, data: response.data };
  } catch (error: any) {
    return { success: false, error: error.response?.data || error.message };
  }
};

// Retry failed notification
export const retryNotification = async (id: string) => {
  try {
    const response = await axios.post(`${BASE_URL}/notifications/${id}/retry`);
    return { success: true, data: response.data };
  } catch (error: any) {
    return { success: false, error: error.response?.data || error.message };
  }
};

// Get notification templates
export const getNotificationTemplates = async () => {
  try {
    const response = await axios.get(`${BASE_URL}/notifications/templates`);
    return response.data;
  } catch (error: any) {
    console.error("Failed to fetch notification templates:", error);
    return [];
  }
};

// Create notification template
export const createNotificationTemplate = async (template: Omit<NotificationTemplate, 'templateId'>) => {
  try {
    const response = await axios.post(`${BASE_URL}/notifications/templates`, template);
    return { success: true, data: response.data };
  } catch (error: any) {
    return { success: false, error: error.response?.data || error.message };
  }
};

// Update notification template
export const updateNotificationTemplate = async (id: string, template: Partial<NotificationTemplate>) => {
  try {
    const response = await axios.put(`${BASE_URL}/notifications/templates/${id}`, template);
    return { success: true, data: response.data };
  } catch (error: any) {
    return { success: false, error: error.response?.data || error.message };
  }
};

// Delete notification template
export const deleteNotificationTemplate = async (id: string) => {
  try {
    await axios.delete(`${BASE_URL}/notifications/templates/${id}`);
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.response?.data || error.message };
  }
};

// Get patient notification preferences
export const getNotificationPreferences = async (patientId: string): Promise<NotificationPreferences> => {
  try {
    const response = await axios.get(`${BASE_URL}/notifications/preferences/${patientId}`);
    return response.data;
  } catch (error: any) {
    console.error("Failed to fetch notification preferences:", error);
    throw new Error("Failed to fetch notification preferences");
  }
};

// Update patient notification preferences
export const updateNotificationPreferences = async (preferences: NotificationPreferences) => {
  try {
    const response = await axios.put(`${BASE_URL}/notifications/preferences`, preferences);
    return { success: true, data: response.data };
  } catch (error: any) {
    return { success: false, error: error.response?.data || error.message };
  }
};

// Get notification statistics
export const getNotificationStats = async (facilityId?: string, dateFrom?: string, dateTo?: string): Promise<NotificationStats> => {
  try {
    const params = new URLSearchParams();
    if (facilityId) params.append('facilityId', facilityId);
    if (dateFrom) params.append('dateFrom', dateFrom);
    if (dateTo) params.append('dateTo', dateTo);

    const response = await axios.get(`${BASE_URL}/notifications/stats?${params}`);
    return response.data;
  } catch (error: any) {
    console.error("Failed to fetch notification stats:", error);
    throw new Error("Failed to fetch notification statistics");
  }
};

// Send appointment reminder
export const sendAppointmentReminder = async (appointmentId: string, reminderMinutes: number = 60) => {
  try {
    const response = await axios.post(`${BASE_URL}/notifications/appointment-reminder`, {
      appointmentId,
      reminderMinutes
    });
    return { success: true, data: response.data };
  } catch (error: any) {
    return { success: false, error: error.response?.data || error.message };
  }
};

// Send appointment confirmation
export const sendAppointmentConfirmation = async (appointmentId: string) => {
  try {
    const response = await axios.post(`${BASE_URL}/notifications/appointment-confirmation`, {
      appointmentId
    });
    return { success: true, data: response.data };
  } catch (error: any) {
    return { success: false, error: error.response?.data || error.message };
  }
};

// Send appointment cancellation notice
export const sendAppointmentCancellation = async (appointmentId: string, reason?: string) => {
  try {
    const response = await axios.post(`${BASE_URL}/notifications/appointment-cancellation`, {
      appointmentId,
      reason
    });
    return { success: true, data: response.data };
  } catch (error: any) {
    return { success: false, error: error.response?.data || error.message };
  }
};

// Get notification audit trail
export const getNotificationAudit = async (notificationId: string): Promise<NotificationAudit[]> => {
  try {
    const response = await axios.get(`${BASE_URL}/notifications/${notificationId}/audit`);
    return response.data;
  } catch (error: any) {
    console.error("Failed to fetch notification audit:", error);
    return [];
  }
};
