import React, { useState, useEffect } from "react";
import { Bell, Mail, MessageSquare, Phone, Send, Clock, CheckCircle, XCircle, AlertCircle } from "lucide-react";
import { getNotifications, sendBulkNotifications, retryNotification } from "../../services/notificationApis";
import { Button } from "../../commonfields/Button";
import { Select } from "../../commonfields/Select";
import { Input } from "../../commonfields/Input";
import { showError, showSuccess } from "../../utils/toastUtils";
import {
  NotificationType,
  NotificationStatus,
  notificationTypeOptions,
  notificationStatusOptions
} from "../../types/appointmentenums";
import type { Notification, NotificationFilters } from "../../types/notification";

interface NotificationCenterProps {
  facilityId?: string;
}

export const NotificationCenter: React.FC<NotificationCenterProps> = ({ facilityId }) => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedNotifications, setSelectedNotifications] = useState<string[]>([]);
  const [filters, setFilters] = useState<NotificationFilters>({
    facilityId,
    page: 0,
    size: 20
  });
  const [totalPages, setTotalPages] = useState(0);
  const [currentPage, setCurrentPage] = useState(0);

  useEffect(() => {
    loadNotifications();
  }, [filters]);

  const loadNotifications = async () => {
    setLoading(true);
    try {
      const response = await getNotifications(filters);
      setNotifications(response.results || []);
      setTotalPages(response.totalPages || 0);
      setCurrentPage(response.page || 0);
    } catch (error) {
      console.error("Failed to load notifications:", error);
      showError("Failed to load notifications");
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (key: keyof NotificationFilters, value: any) => {
    setFilters(prev => ({
      ...prev,
      [key]: value,
      page: 0 // Reset to first page when filters change
    }));
  };

  const handleSelectNotification = (notificationId: string) => {
    setSelectedNotifications(prev => 
      prev.includes(notificationId)
        ? prev.filter(id => id !== notificationId)
        : [...prev, notificationId]
    );
  };

  const handleSelectAll = () => {
    if (selectedNotifications.length === notifications.length) {
      setSelectedNotifications([]);
    } else {
      setSelectedNotifications(notifications.map(n => n.notificationId!));
    }
  };

  const handleRetrySelected = async () => {
    if (selectedNotifications.length === 0) return;

    try {
      const retryPromises = selectedNotifications.map(id => retryNotification(id));
      await Promise.all(retryPromises);
      showSuccess(`Retrying ${selectedNotifications.length} notifications`);
      setSelectedNotifications([]);
      loadNotifications();
    } catch (error) {
      showError("Failed to retry notifications");
    }
  };

  const getNotificationIcon = (type: NotificationType) => {
    switch (type) {
      case NotificationType.SMS:
        return <MessageSquare size={16} className="text-blue-600" />;
      case NotificationType.Email:
        return <Mail size={16} className="text-green-600" />;
      case NotificationType.WhatsApp:
        return <MessageSquare size={16} className="text-green-600" />;
      case NotificationType.Call:
        return <Phone size={16} className="text-purple-600" />;
      default:
        return <Bell size={16} className="text-gray-600" />;
    }
  };

  const getStatusIcon = (status: NotificationStatus) => {
    switch (status) {
      case NotificationStatus.Pending:
        return <Clock size={16} className="text-yellow-600" />;
      case NotificationStatus.Sent:
        return <Send size={16} className="text-blue-600" />;
      case NotificationStatus.Delivered:
        return <CheckCircle size={16} className="text-green-600" />;
      case NotificationStatus.Failed:
        return <XCircle size={16} className="text-red-600" />;
      case NotificationStatus.Read:
        return <CheckCircle size={16} className="text-green-700" />;
      default:
        return <AlertCircle size={16} className="text-gray-600" />;
    }
  };

  const getStatusColor = (status: NotificationStatus): string => {
    switch (status) {
      case NotificationStatus.Pending:
        return 'bg-yellow-100 text-yellow-800';
      case NotificationStatus.Sent:
        return 'bg-blue-100 text-blue-800';
      case NotificationStatus.Delivered:
        return 'bg-green-100 text-green-800';
      case NotificationStatus.Failed:
        return 'bg-red-100 text-red-800';
      case NotificationStatus.Read:
        return 'bg-green-100 text-green-900';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const formatDateTime = (dateString: string): string => {
    return new Date(dateString).toLocaleString();
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center space-x-3">
          <Bell className="text-indigo-600" size={24} />
          <h2 className="text-xl font-semibold text-gray-800">Notification Center</h2>
        </div>
        <div className="flex space-x-2">
          {selectedNotifications.length > 0 && (
            <Button
              onClick={handleRetrySelected}
              className="flex items-center space-x-2 px-3 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
            >
              <Send size={16} />
              <span>Retry Selected ({selectedNotifications.length})</span>
            </Button>
          )}
        </div>
      </div>

      {/* Filters */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Type</label>
          <Select
            value={filters.type?.[0] || ""}
            onChange={(e) => handleFilterChange("type", e.target.value ? [e.target.value] : undefined)}
          >
            <option value="">All Types</option>
            {notificationTypeOptions.map((type) => (
              <option key={type} value={type}>{type}</option>
            ))}
          </Select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
          <Select
            value={filters.status?.[0] || ""}
            onChange={(e) => handleFilterChange("status", e.target.value ? [e.target.value] : undefined)}
          >
            <option value="">All Statuses</option>
            {notificationStatusOptions.map((status) => (
              <option key={status} value={status}>{status}</option>
            ))}
          </Select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">From Date</label>
          <Input
            type="date"
            value={filters.dateFrom || ""}
            onChange={(e) => handleFilterChange("dateFrom", e.target.value)}
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">To Date</label>
          <Input
            type="date"
            value={filters.dateTo || ""}
            onChange={(e) => handleFilterChange("dateTo", e.target.value)}
          />
        </div>
      </div>

      {/* Notifications List */}
      {loading ? (
        <div className="text-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600 mx-auto"></div>
          <p className="mt-2 text-gray-600">Loading notifications...</p>
        </div>
      ) : (
        <div className="space-y-4">
          {/* Select All */}
          {notifications.length > 0 && (
            <div className="flex items-center space-x-2 pb-2 border-b border-gray-200">
              <input
                type="checkbox"
                checked={selectedNotifications.length === notifications.length}
                onChange={handleSelectAll}
                className="form-checkbox h-4 w-4 text-indigo-600"
              />
              <span className="text-sm text-gray-600">
                Select All ({notifications.length} notifications)
              </span>
            </div>
          )}

          {/* Notification Items */}
          {notifications.map((notification) => (
            <div
              key={notification.notificationId}
              className="flex items-center space-x-4 p-4 border border-gray-200 rounded-lg hover:bg-gray-50"
            >
              <input
                type="checkbox"
                checked={selectedNotifications.includes(notification.notificationId!)}
                onChange={() => handleSelectNotification(notification.notificationId!)}
                className="form-checkbox h-4 w-4 text-indigo-600"
              />
              
              <div className="flex items-center space-x-2">
                {getNotificationIcon(notification.type)}
                {getStatusIcon(notification.status)}
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-medium text-gray-900 truncate">
                    {notification.title}
                  </h3>
                  <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(notification.status)}`}>
                    {notification.status}
                  </span>
                </div>
                <p className="text-sm text-gray-600 truncate">{notification.message}</p>
                <div className="flex items-center space-x-4 mt-1 text-xs text-gray-500">
                  <span>To: {notification.recipientName}</span>
                  <span>Scheduled: {formatDateTime(notification.scheduledAt)}</span>
                  {notification.sentAt && (
                    <span>Sent: {formatDateTime(notification.sentAt)}</span>
                  )}
                </div>
              </div>

              {notification.status === NotificationStatus.Failed && (
                <Button
                  onClick={() => retryNotification(notification.notificationId!)}
                  className="px-3 py-1 text-xs bg-red-600 text-white rounded hover:bg-red-700"
                >
                  Retry
                </Button>
              )}
            </div>
          ))}

          {notifications.length === 0 && (
            <div className="text-center py-8">
              <Bell className="mx-auto text-gray-400 mb-4" size={48} />
              <h3 className="text-lg font-medium text-gray-600 mb-2">No notifications found</h3>
              <p className="text-gray-500">No notifications match your current filters</p>
            </div>
          )}
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between mt-6 pt-4 border-t border-gray-200">
          <div className="text-sm text-gray-600">
            Page {currentPage + 1} of {totalPages}
          </div>
          <div className="flex space-x-2">
            <Button
              onClick={() => handleFilterChange("page", Math.max(0, currentPage - 1))}
              disabled={currentPage === 0}
              className="px-3 py-1 border border-gray-300 text-gray-700 rounded hover:bg-gray-50 disabled:opacity-50"
            >
              Previous
            </Button>
            <Button
              onClick={() => handleFilterChange("page", Math.min(totalPages - 1, currentPage + 1))}
              disabled={currentPage >= totalPages - 1}
              className="px-3 py-1 border border-gray-300 text-gray-700 rounded hover:bg-gray-50 disabled:opacity-50"
            >
              Next
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};
