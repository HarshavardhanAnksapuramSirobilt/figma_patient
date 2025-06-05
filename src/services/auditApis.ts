import axios from "axios";
import { AuditAction } from '../types/appointmentenums';

const BASE_URL = "https://megha-dev.sirobilt.com/api";

// Audit Trail Interface
export interface AuditTrail {
  auditId?: string;
  entityType: string; // 'appointment', 'provider', 'notification', etc.
  entityId: string;
  action: AuditAction;
  oldValues?: Record<string, any>;
  newValues?: Record<string, any>;
  changes?: string[];
  description?: string;
  timestamp: string;
  performedBy: string;
  performedByName?: string;
  ipAddress?: string;
  userAgent?: string;
  sessionId?: string;
  facilityId?: string;
}

// Audit Search Filters
export interface AuditFilters {
  entityType?: string;
  entityId?: string;
  action?: AuditAction[];
  performedBy?: string;
  facilityId?: string;
  dateFrom?: string;
  dateTo?: string;
  searchTerm?: string;
  page?: number;
  size?: number;
}

// Create audit trail entry
export const createAuditTrail = async (audit: Omit<AuditTrail, 'auditId' | 'timestamp'>) => {
  try {
    const auditEntry = {
      ...audit,
      timestamp: new Date().toISOString(),
      ipAddress: await getClientIP(),
      userAgent: navigator.userAgent
    };
    
    console.log("Creating audit trail:", auditEntry);
    const response = await axios.post(`${BASE_URL}/audit`, auditEntry);
    return { success: true, data: response.data };
  } catch (error: any) {
    console.error("Create Audit Trail Error:", error.response?.data || error.message);
    return { success: false, error: error.response?.data || error.message };
  }
};

// Get audit trails with filters
export const getAuditTrails = async (filters: AuditFilters = {}) => {
  try {
    const params = new URLSearchParams();
    
    // Add filter parameters
    if (filters.entityType) params.append('entityType', filters.entityType);
    if (filters.entityId) params.append('entityId', filters.entityId);
    if (filters.action?.length) params.append('action', filters.action.join(','));
    if (filters.performedBy) params.append('performedBy', filters.performedBy);
    if (filters.facilityId) params.append('facilityId', filters.facilityId);
    if (filters.dateFrom) params.append('dateFrom', filters.dateFrom);
    if (filters.dateTo) params.append('dateTo', filters.dateTo);
    if (filters.searchTerm) params.append('search', filters.searchTerm);
    if (filters.page !== undefined) params.append('page', filters.page.toString());
    if (filters.size !== undefined) params.append('size', filters.size.toString());

    const response = await axios.get(`${BASE_URL}/audit?${params}`);
    return response.data;
  } catch (error: any) {
    console.error("Failed to fetch audit trails:", error);
    return { results: [], totalElements: 0, totalPages: 0 };
  }
};

// Get audit trail by ID
export const getAuditTrailById = async (id: string): Promise<AuditTrail> => {
  try {
    const response = await axios.get(`${BASE_URL}/audit/${id}`);
    return response.data;
  } catch (error: any) {
    console.error("Fetch Audit Trail Error:", error);
    throw new Error("Failed to fetch audit trail data");
  }
};

// Get audit trails for a specific entity
export const getEntityAuditTrails = async (entityType: string, entityId: string) => {
  return getAuditTrails({
    entityType,
    entityId,
    page: 0,
    size: 100
  });
};

// Get recent audit activities
export const getRecentAuditActivities = async (facilityId?: string, hours: number = 24) => {
  const dateFrom = new Date(Date.now() - (hours * 60 * 60 * 1000)).toISOString();
  
  return getAuditTrails({
    facilityId,
    dateFrom,
    page: 0,
    size: 50
  });
};

// Audit helper functions for common actions

// Log appointment creation
export const logAppointmentCreation = async (
  appointmentId: string,
  appointmentData: any,
  performedBy: string,
  facilityId?: string
) => {
  return createAuditTrail({
    entityType: 'appointment',
    entityId: appointmentId,
    action: AuditAction.Create,
    newValues: appointmentData,
    description: `Appointment created for patient ${appointmentData.patientId}`,
    performedBy,
    facilityId
  });
};

// Log appointment update
export const logAppointmentUpdate = async (
  appointmentId: string,
  oldData: any,
  newData: any,
  performedBy: string,
  facilityId?: string
) => {
  const changes = getChangedFields(oldData, newData);
  
  return createAuditTrail({
    entityType: 'appointment',
    entityId: appointmentId,
    action: AuditAction.Update,
    oldValues: oldData,
    newValues: newData,
    changes,
    description: `Appointment updated: ${changes.join(', ')}`,
    performedBy,
    facilityId
  });
};

// Log appointment cancellation
export const logAppointmentCancellation = async (
  appointmentId: string,
  reason: string,
  performedBy: string,
  facilityId?: string
) => {
  return createAuditTrail({
    entityType: 'appointment',
    entityId: appointmentId,
    action: AuditAction.Cancel,
    description: `Appointment cancelled. Reason: ${reason}`,
    performedBy,
    facilityId
  });
};

// Log appointment completion
export const logAppointmentCompletion = async (
  appointmentId: string,
  notes: string,
  performedBy: string,
  facilityId?: string
) => {
  return createAuditTrail({
    entityType: 'appointment',
    entityId: appointmentId,
    action: AuditAction.Complete,
    description: `Appointment completed. Notes: ${notes}`,
    performedBy,
    facilityId
  });
};

// Log appointment view
export const logAppointmentView = async (
  appointmentId: string,
  performedBy: string,
  facilityId?: string
) => {
  return createAuditTrail({
    entityType: 'appointment',
    entityId: appointmentId,
    action: AuditAction.View,
    description: 'Appointment details viewed',
    performedBy,
    facilityId
  });
};

// Log provider schedule view
export const logProviderScheduleView = async (
  providerId: string,
  date: string,
  performedBy: string,
  facilityId?: string
) => {
  return createAuditTrail({
    entityType: 'provider',
    entityId: providerId,
    action: AuditAction.View,
    description: `Provider schedule viewed for date: ${date}`,
    performedBy,
    facilityId
  });
};

// Utility functions

// Get client IP address
const getClientIP = async (): Promise<string> => {
  try {
    const response = await fetch('https://api.ipify.org?format=json');
    const data = await response.json();
    return data.ip;
  } catch (error) {
    return 'unknown';
  }
};

// Compare objects and get changed fields
const getChangedFields = (oldData: any, newData: any): string[] => {
  const changes: string[] = [];
  
  for (const key in newData) {
    if (oldData[key] !== newData[key]) {
      changes.push(key);
    }
  }
  
  return changes;
};

// Export audit statistics
export const getAuditStatistics = async (facilityId?: string, dateFrom?: string, dateTo?: string) => {
  try {
    const params = new URLSearchParams();
    if (facilityId) params.append('facilityId', facilityId);
    if (dateFrom) params.append('dateFrom', dateFrom);
    if (dateTo) params.append('dateTo', dateTo);

    const response = await axios.get(`${BASE_URL}/audit/stats?${params}`);
    return response.data;
  } catch (error: any) {
    console.error("Failed to fetch audit statistics:", error);
    throw new Error("Failed to fetch audit statistics");
  }
};
