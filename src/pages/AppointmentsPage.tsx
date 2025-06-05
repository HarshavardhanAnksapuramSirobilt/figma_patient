import React, { useState, useEffect } from "react";
import { Calendar, Clock, Users, Plus, Filter, Search } from "lucide-react";
import { AppointmentCalendar } from "../components/appointments/AppointmentCalendar";
import { AppointmentForm } from "../components/appointments/AppointmentForm";
import { useAppointmentStore } from "../store/appointmentStore";
import { useProviderStore } from "../store/providerStore";
import { getAppointmentStats } from "../services/appointmentApis";
import { getProviders } from "../services/providerApis";
import { Button } from "../commonfields/Button";
import { Select } from "../commonfields/Select";
import { Input } from "../commonfields/Input";
import { showError } from "../utils/toastUtils";
import type { Appointment } from "../types/appointment";
import type { Provider } from "../types/provider";

const AppointmentsPage: React.FC = () => {
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null);
  const [showFilters, setShowFilters] = useState(false);
  const [selectedProviderId, setSelectedProviderId] = useState<string>("");
  const [searchTerm, setSearchTerm] = useState("");

  const { 
    appointmentStats, 
    setAppointmentStats,
    selectedDate,
    setSelectedDate 
  } = useAppointmentStore();

  const { 
    providers, 
    setProviders,
    loading: providersLoading 
  } = useProviderStore();

  useEffect(() => {
    loadInitialData();
  }, []);

  const loadInitialData = async () => {
    try {
      // Load providers
      const providersResponse = await getProviders({ isActive: true, size: 100 });
      setProviders(providersResponse.results || []);

      // Load appointment statistics
      const stats = await getAppointmentStats();
      setAppointmentStats(stats);
    } catch (error) {
      console.error("Failed to load initial data:", error);
      showError("Failed to load appointment data");
    }
  };

  const handleSelectAppointment = (appointment: Appointment) => {
    setSelectedAppointment(appointment);
    // You can open a modal or navigate to appointment details here
    console.log("Selected appointment:", appointment);
  };

  const handleSelectSlot = (slotInfo: { start: Date; end: Date; slots: Date[] }) => {
    // Pre-fill form with selected time slot
    const appointmentDate = slotInfo.start.toISOString().split('T')[0];
    const startTime = slotInfo.start.toTimeString().slice(0, 5);
    const endTime = slotInfo.end.toTimeString().slice(0, 5);
    
    // You can pass this data to the appointment form
    setShowCreateForm(true);
    console.log("Selected slot:", { appointmentDate, startTime, endTime });
  };

  const handleCreateSuccess = () => {
    setShowCreateForm(false);
    // Refresh data if needed
    loadInitialData();
  };

  const StatCard = ({ 
    title, 
    value, 
    icon, 
    color = "blue" 
  }: { 
    title: string; 
    value: string | number; 
    icon: React.ReactNode; 
    color?: string;
  }) => (
    <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <p className="text-2xl font-bold text-gray-900">{value}</p>
        </div>
        <div className={`p-3 rounded-full bg-${color}-100 text-${color}-600`}>
          {icon}
        </div>
      </div>
    </div>
  );

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Appointments</h1>
          <p className="text-gray-600">Manage and schedule appointments</p>
        </div>
        <div className="flex space-x-3">
          <Button
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center space-x-2 px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50"
          >
            <Filter size={16} />
            <span>Filters</span>
          </Button>
          <Button
            onClick={() => setShowCreateForm(true)}
            className="flex items-center space-x-2 px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
          >
            <Plus size={16} />
            <span>New Appointment</span>
          </Button>
        </div>
      </div>

      {/* Statistics Cards */}
      {appointmentStats && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
          <StatCard
            title="Today's Appointments"
            value={appointmentStats.todayAppointments}
            icon={<Calendar size={20} />}
            color="blue"
          />
          <StatCard
            title="Upcoming"
            value={appointmentStats.upcomingAppointments}
            icon={<Clock size={20} />}
            color="green"
          />
          <StatCard
            title="Completed"
            value={appointmentStats.completedAppointments}
            icon={<Users size={20} />}
            color="gray"
          />
          <StatCard
            title="Total"
            value={appointmentStats.totalAppointments}
            icon={<Calendar size={20} />}
            color="purple"
          />
        </div>
      )}

      {/* Filters Panel */}
      {showFilters && (
        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Provider
              </label>
              <Select
                value={selectedProviderId}
                onChange={(e) => setSelectedProviderId(e.target.value)}
              >
                <option value="">All Providers</option>
                {providers.map((provider) => (
                  <option key={provider.providerId} value={provider.providerId}>
                    {provider.title} {provider.firstName} {provider.lastName}
                  </option>
                ))}
              </Select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Date
              </label>
              <Input
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Search
              </label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
                <Input
                  placeholder="Search appointments..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Calendar View */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <AppointmentCalendar
          onSelectAppointment={handleSelectAppointment}
          onSelectSlot={handleSelectSlot}
          selectedProviderId={selectedProviderId}
          facilityId={undefined} // You can add facility filter here
        />
      </div>

      {/* Create Appointment Modal */}
      {showCreateForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full mx-4 max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-xl font-semibold text-gray-800">Create New Appointment</h2>
            </div>
            <div className="p-6">
              <AppointmentForm
                onSuccess={handleCreateSuccess}
                onCancel={() => setShowCreateForm(false)}
              />
            </div>
          </div>
        </div>
      )}

      {/* Appointment Details Modal */}
      {selectedAppointment && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full mx-4">
            <div className="p-6 border-b border-gray-200">
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-semibold text-gray-800">Appointment Details</h2>
                <button
                  onClick={() => setSelectedAppointment(null)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  ×
                </button>
              </div>
            </div>
            <div className="p-6">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Patient</label>
                  <p className="text-gray-900">
                    {selectedAppointment.patient?.firstName} {selectedAppointment.patient?.lastName}
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Provider</label>
                  <p className="text-gray-900">
                    {selectedAppointment.provider?.title} {selectedAppointment.provider?.firstName} {selectedAppointment.provider?.lastName}
                  </p>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Date</label>
                    <p className="text-gray-900">{selectedAppointment.appointmentDate}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Time</label>
                    <p className="text-gray-900">
                      {selectedAppointment.startTime} - {selectedAppointment.endTime}
                    </p>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Status</label>
                  <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                    selectedAppointment.status === 'Confirmed' ? 'bg-green-100 text-green-800' :
                    selectedAppointment.status === 'Scheduled' ? 'bg-blue-100 text-blue-800' :
                    selectedAppointment.status === 'Cancelled' ? 'bg-red-100 text-red-800' :
                    'bg-gray-100 text-gray-800'
                  }`}>
                    {selectedAppointment.status}
                  </span>
                </div>
                {selectedAppointment.notes && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Notes</label>
                    <p className="text-gray-900">{selectedAppointment.notes}</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AppointmentsPage;
