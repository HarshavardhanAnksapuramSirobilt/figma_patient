import React, { useState, useEffect } from "react";
import { Calendar, Clock, User, Printer, Download } from "lucide-react";
import { getProviderSchedule, getAvailableSlots } from "../../services/appointmentApis";
import { getProviderById } from "../../services/providerApis";
import { logProviderScheduleView } from "../../services/auditApis";
import { Button } from "../../commonfields/Button";
import { Select } from "../../commonfields/Select";
import { Calendar as CalendarInput } from "../../commonfields/Calendar";
import { showError } from "../../utils/toastUtils";
import { printSchedule, exportScheduleToPDF } from "../../utils/printUtils";
import type { ProviderSchedule as ProviderScheduleType, TimeSlot } from "../../types/appointment";
import type { Provider } from "../../types/provider";

interface ProviderScheduleProps {
  providerId?: string;
  selectedDate?: string;
  onSlotSelect?: (slot: TimeSlot) => void;
  showActions?: boolean;
}

export const ProviderSchedule: React.FC<ProviderScheduleProps> = ({
  providerId: initialProviderId,
  selectedDate: initialDate,
  onSlotSelect,
  showActions = true
}) => {
  const [providerId, setProviderId] = useState(initialProviderId || "");
  const [selectedDate, setSelectedDate] = useState(initialDate || new Date().toISOString().split('T')[0]);
  const [provider, setProvider] = useState<Provider | null>(null);
  const [schedule, setSchedule] = useState<ProviderScheduleType | null>(null);
  const [availableSlots, setAvailableSlots] = useState<TimeSlot[]>([]);
  const [providers, setProviders] = useState<Provider[]>([]);
  const [loading, setLoading] = useState(false);
  const [loadingProviders, setLoadingProviders] = useState(false);

  useEffect(() => {
    loadProviders();
  }, []);

  useEffect(() => {
    if (providerId) {
      loadProviderData();
      loadScheduleData();
    }
  }, [providerId, selectedDate]);

  const loadProviders = async () => {
    setLoadingProviders(true);
    try {
      // This would typically come from your provider API
      const response = await fetch('/api/providers?isActive=true&size=100');
      const data = await response.json();
      setProviders(data.results || []);
    } catch (error) {
      console.error("Failed to load providers:", error);
    } finally {
      setLoadingProviders(false);
    }
  };

  const loadProviderData = async () => {
    try {
      const providerData = await getProviderById(providerId);
      setProvider(providerData);
    } catch (error) {
      console.error("Failed to load provider data:", error);
      showError("Failed to load provider information");
    }
  };

  const loadScheduleData = async () => {
    setLoading(true);
    try {
      // Load provider schedule
      const scheduleData = await getProviderSchedule(providerId, selectedDate);
      setSchedule(scheduleData);

      // Load available slots
      const slotsData = await getAvailableSlots(providerId, selectedDate);
      setAvailableSlots(slotsData);

      // Log audit trail
      await logProviderScheduleView(
        providerId,
        selectedDate,
        'current-user-id', // You would get this from your auth context
        provider?.facilityId
      );
    } catch (error) {
      console.error("Failed to load schedule data:", error);
      showError("Failed to load schedule data");
    } finally {
      setLoading(false);
    }
  };

  const handleSlotClick = (slot: TimeSlot) => {
    if (slot.isAvailable && onSlotSelect) {
      onSlotSelect(slot);
    }
  };

  const handlePrintSchedule = () => {
    if (provider && schedule) {
      printSchedule(provider, schedule, selectedDate);
    }
  };

  const handleExportToPDF = () => {
    if (provider && schedule) {
      exportScheduleToPDF(provider, schedule, selectedDate);
    }
  };

  const getSlotStatusColor = (slot: TimeSlot): string => {
    if (slot.isBlocked) return 'bg-red-100 text-red-800 border-red-200';
    if (!slot.isAvailable) return 'bg-gray-100 text-gray-800 border-gray-200';
    return 'bg-green-100 text-green-800 border-green-200 hover:bg-green-200 cursor-pointer';
  };

  const getSlotStatusText = (slot: TimeSlot): string => {
    if (slot.isBlocked) return `Blocked: ${slot.blockReason || 'Unavailable'}`;
    if (!slot.isAvailable) return 'Booked';
    return 'Available';
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center space-x-3">
          <Calendar className="text-indigo-600" size={24} />
          <h2 className="text-xl font-semibold text-gray-800">Provider Schedule</h2>
        </div>
        {showActions && provider && (
          <div className="flex space-x-2">
            <Button
              onClick={handlePrintSchedule}
              className="flex items-center space-x-2 px-3 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50"
            >
              <Printer size={16} />
              <span>Print</span>
            </Button>
            <Button
              onClick={handleExportToPDF}
              className="flex items-center space-x-2 px-3 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50"
            >
              <Download size={16} />
              <span>Export PDF</span>
            </Button>
          </div>
        )}
      </div>

      {/* Filters */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Provider
          </label>
          <Select
            value={providerId}
            onChange={(e) => setProviderId(e.target.value)}
            disabled={loadingProviders}
          >
            <option value="">Select Provider</option>
            {providers.map((p) => (
              <option key={p.providerId} value={p.providerId}>
                {p.title} {p.firstName} {p.lastName} - {p.specialization}
              </option>
            ))}
          </Select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Date
          </label>
          <CalendarInput
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
          />
        </div>
      </div>

      {/* Provider Information */}
      {provider && (
        <div className="bg-gray-50 rounded-lg p-4 mb-6">
          <div className="flex items-center space-x-4">
            <div className="bg-indigo-100 p-3 rounded-full">
              <User className="text-indigo-600" size={24} />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-800">
                {provider.title} {provider.firstName} {provider.lastName}
              </h3>
              <p className="text-gray-600">{provider.specialization}</p>
              <p className="text-sm text-gray-500">{provider.department}</p>
            </div>
          </div>
        </div>
      )}

      {/* Loading State */}
      {loading && (
        <div className="flex items-center justify-center py-12">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600 mx-auto"></div>
            <p className="mt-2 text-sm text-gray-600">Loading schedule...</p>
          </div>
        </div>
      )}

      {/* Schedule Display */}
      {!loading && schedule && (
        <div>
          {/* Working Hours Info */}
          <div className="mb-4 p-3 bg-blue-50 rounded-lg">
            <div className="flex items-center space-x-2">
              <Clock className="text-blue-600" size={16} />
              <span className="text-sm font-medium text-blue-800">
                Working Hours: {schedule.workingHours.startTime} - {schedule.workingHours.endTime}
              </span>
            </div>
            {schedule.specialNotes && (
              <p className="text-sm text-blue-700 mt-1">{schedule.specialNotes}</p>
            )}
          </div>

          {/* Time Slots Grid */}
          {schedule.isWorkingDay ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
              {schedule.timeSlots.map((slot, index) => (
                <div
                  key={index}
                  onClick={() => handleSlotClick(slot)}
                  className={`p-3 rounded-lg border-2 transition-colors ${getSlotStatusColor(slot)}`}
                >
                  <div className="text-sm font-medium">
                    {slot.startTime} - {slot.endTime}
                  </div>
                  <div className="text-xs mt-1">
                    {getSlotStatusText(slot)}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <Calendar className="mx-auto text-gray-400 mb-4" size={48} />
              <h3 className="text-lg font-medium text-gray-600 mb-2">Non-Working Day</h3>
              <p className="text-gray-500">
                {provider?.firstName} is not available on this date.
              </p>
            </div>
          )}
        </div>
      )}

      {/* No Provider Selected */}
      {!providerId && !loading && (
        <div className="text-center py-12">
          <User className="mx-auto text-gray-400 mb-4" size={48} />
          <h3 className="text-lg font-medium text-gray-600 mb-2">Select a Provider</h3>
          <p className="text-gray-500">
            Choose a provider to view their schedule and available time slots.
          </p>
        </div>
      )}

      {/* Legend */}
      {schedule && schedule.isWorkingDay && (
        <div className="mt-6 pt-4 border-t border-gray-200">
          <h4 className="text-sm font-medium text-gray-700 mb-3">Legend</h4>
          <div className="flex flex-wrap gap-4 text-xs">
            <div className="flex items-center space-x-2">
              <div className="w-4 h-4 bg-green-100 border border-green-200 rounded"></div>
              <span>Available</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-4 h-4 bg-gray-100 border border-gray-200 rounded"></div>
              <span>Booked</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-4 h-4 bg-red-100 border border-red-200 rounded"></div>
              <span>Blocked</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
