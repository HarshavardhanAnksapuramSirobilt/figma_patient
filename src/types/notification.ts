import {
  NotificationType,
  NotificationStatus
} from "./appointmentenums";

// Core Notification Interface
export interface Notification {
  notificationId?: string;
  appointmentId: string;
  patientId: string;
  providerId?: string;
  facilityId: string;
  
  // Notification Details
  type: NotificationType;
  status: NotificationStatus;
  title: string;
  message: string;
  
  // Recipient Information
  recipientName: string;
  recipientPhone?: string;
  recipientEmail?: string;
  
  // Scheduling
  scheduledAt: string; // When to send
  sentAt?: string; // When actually sent
  deliveredAt?: string; // When delivered
  readAt?: string; // When read/opened
  
  // Retry Logic
  retryCount?: number;
  maxRetries?: number;
  nextRetryAt?: string;
  
  // Error Handling
  errorMessage?: string;
  failureReason?: string;
  
  // Metadata
  createdAt?: string;
  updatedAt?: string;
  createdBy?: string;
  
  // Template & Customization
  templateId?: string;
  customData?: Record<string, any>;
}

// Notification Template
export interface NotificationTemplate {
  templateId: string;
  name: string;
  type: NotificationType;
  subject?: string; // For email
  messageTemplate: string;
  isActive: boolean;
  
  // Template Variables
  variables: string[]; // e.g., ['patientName', 'appointmentDate', 'providerName']
  
  // Timing
  triggerEvent: NotificationTrigger;
  sendBefore?: number; // minutes before appointment
  
  // Metadata
  createdAt?: string;
  updatedAt?: string;
  createdBy?: string;
}

// Notification Triggers
export enum NotificationTrigger {
  AppointmentCreated = "AppointmentCreated",
  AppointmentConfirmed = "AppointmentConfirmed",
  AppointmentReminder = "AppointmentReminder",
  AppointmentCancelled = "AppointmentCancelled",
  AppointmentRescheduled = "AppointmentRescheduled",
  AppointmentCompleted = "AppointmentCompleted",
  AppointmentNoShow = "AppointmentNoShow",
  ProviderRunningLate = "ProviderRunningLate",
  CustomReminder = "CustomReminder"
}

// Notification Preferences
export interface NotificationPreferences {
  patientId: string;
  
  // Channel Preferences
  enableSMS: boolean;
  enableEmail: boolean;
  enableWhatsApp: boolean;
  enablePush: boolean;
  enableCall: boolean;
  
  // Timing Preferences
  reminderTiming: number[]; // minutes before appointment [1440, 60, 15] = 1 day, 1 hour, 15 minutes
  
  // Content Preferences
  language: string;
  timezone: string;
  
  // Opt-out Options
  optOutAll: boolean;
  optOutMarketing: boolean;
  
  // Contact Information
  preferredPhone?: string;
  preferredEmail?: string;
  
  // Metadata
  updatedAt?: string;
}

// Bulk Notification Request
export interface BulkNotificationRequest {
  templateId: string;
  appointmentIds: string[];
  scheduledAt?: string; // If not provided, send immediately
  customData?: Record<string, any>;
  priority?: 'Low' | 'Normal' | 'High' | 'Urgent';
}

// Notification Statistics
export interface NotificationStats {
  totalSent: number;
  totalDelivered: number;
  totalFailed: number;
  totalRead: number;
  
  // By Type
  smsStats: {
    sent: number;
    delivered: number;
    failed: number;
  };
  emailStats: {
    sent: number;
    delivered: number;
    failed: number;
    opened: number;
  };
  whatsappStats: {
    sent: number;
    delivered: number;
    failed: number;
    read: number;
  };
  
  // By Time Period
  todayStats: NotificationDayStats;
  weekStats: NotificationDayStats;
  monthStats: NotificationDayStats;
}

export interface NotificationDayStats {
  sent: number;
  delivered: number;
  failed: number;
  deliveryRate: number; // percentage
}

// Notification Search/Filter Parameters
export interface NotificationFilters {
  appointmentId?: string;
  patientId?: string;
  providerId?: string;
  facilityId?: string;
  type?: NotificationType[];
  status?: NotificationStatus[];
  dateFrom?: string;
  dateTo?: string;
  searchTerm?: string;
  page?: number;
  size?: number;
}

// Audit Trail for Notifications
export interface NotificationAudit {
  auditId?: string;
  notificationId: string;
  action: string;
  oldStatus?: NotificationStatus;
  newStatus?: NotificationStatus;
  details?: string;
  timestamp: string;
  performedBy?: string;
  ipAddress?: string;
  userAgent?: string;
}

// Default notification preferences
export const defaultNotificationPreferences: NotificationPreferences = {
  patientId: "",
  enableSMS: true,
  enableEmail: true,
  enableWhatsApp: false,
  enablePush: true,
  enableCall: false,
  reminderTiming: [1440, 60, 15], // 1 day, 1 hour, 15 minutes
  language: "en",
  timezone: "Asia/Kolkata",
  optOutAll: false,
  optOutMarketing: false
};
