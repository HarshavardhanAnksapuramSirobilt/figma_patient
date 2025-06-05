import React, { useState, useEffect } from "react";
import { Calendar, Users, Clock, Bell, Shield } from "lucide-react";
import { getAppointments, getAppointmentStats } from "../services/appointmentApis";
import { getProviders } from "../services/providerApis";
import { getAllPatients } from "../services/patientApis";
import { mockNotifications, mockAuditTrails } from "../mockData/appointmentMockData";
import type { Appointment, AppointmentStats } from "../types/appointment";
import type { Provider } from "../types/provider";

const AppointmentTestPage: React.FC = () => {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [providers, setProviders] = useState<Provider[]>([]);
  const [patients, setPatients] = useState<any[]>([]);
  const [stats, setStats] = useState<AppointmentStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadTestData();
  }, []);

  const loadTestData = async () => {
    setLoading(true);
    try {
      // Load all mock data
      const [appointmentsData, providersData, patientsData, statsData] = await Promise.all([
        getAppointments({ size: 10 }),
        getProviders({ size: 10 }),
        getAllPatients(),
        getAppointmentStats()
      ]);

      setAppointments(appointmentsData.results || []);
      setProviders(providersData.results || []);
      setPatients(patientsData || []);
      setStats(statsData);
    } catch (error) {
      console.error("Failed to load test data:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading mock data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">
            🎉 Appointments Module Test Page
          </h1>
          <p className="text-gray-600">
            Testing all mock data and functionality for the appointments module
          </p>
        </div>

        {/* Statistics Cards */}
        {stats && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Appointments</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.totalAppointments}</p>
                </div>
                <Calendar className="text-blue-600" size={24} />
              </div>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Today's Appointments</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.todayAppointments}</p>
                </div>
                <Clock className="text-green-600" size={24} />
              </div>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Completed</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.completedAppointments}</p>
                </div>
                <Users className="text-purple-600" size={24} />
              </div>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Upcoming</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.upcomingAppointments}</p>
                </div>
                <Calendar className="text-orange-600" size={24} />
              </div>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Recent Appointments */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
              <Calendar className="mr-2 text-indigo-600" size={20} />
              Recent Appointments ({appointments.length})
            </h2>
            <div className="space-y-3">
              {appointments.slice(0, 5).map((appointment) => (
                <div key={appointment.appointmentId} className="border border-gray-200 rounded-lg p-3">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-medium text-gray-900">
                        {appointment.patient?.firstName} {appointment.patient?.lastName}
                      </h3>
                      <p className="text-sm text-gray-600">
                        {appointment.provider?.title} {appointment.provider?.firstName} {appointment.provider?.lastName}
                      </p>
                      <p className="text-xs text-gray-500">
                        {appointment.appointmentDate} at {appointment.startTime}
                      </p>
                    </div>
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                      appointment.status === 'Confirmed' ? 'bg-green-100 text-green-800' :
                      appointment.status === 'Scheduled' ? 'bg-blue-100 text-blue-800' :
                      appointment.status === 'Completed' ? 'bg-gray-100 text-gray-800' :
                      appointment.status === 'Cancelled' ? 'bg-red-100 text-red-800' :
                      'bg-yellow-100 text-yellow-800'
                    }`}>
                      {appointment.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Providers */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
              <Users className="mr-2 text-indigo-600" size={20} />
              Healthcare Providers ({providers.length})
            </h2>
            <div className="space-y-3">
              {providers.map((provider) => (
                <div key={provider.providerId} className="border border-gray-200 rounded-lg p-3">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-medium text-gray-900">
                        {provider.title} {provider.firstName} {provider.lastName}
                      </h3>
                      <p className="text-sm text-gray-600">{provider.specialization}</p>
                      <p className="text-xs text-gray-500">{provider.experience} years experience</p>
                    </div>
                    <div className="text-right">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                        provider.status === 'Available' ? 'bg-green-100 text-green-800' :
                        provider.status === 'Busy' ? 'bg-red-100 text-red-800' :
                        'bg-yellow-100 text-yellow-800'
                      }`}>
                        {provider.status}
                      </span>
                      {provider.consultationFee && (
                        <p className="text-sm text-green-600 font-medium mt-1">
                          ₹{provider.consultationFee}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Patients */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
              <Users className="mr-2 text-indigo-600" size={20} />
              Registered Patients ({patients.length})
            </h2>
            <div className="space-y-3">
              {patients.map((patient) => (
                <div key={patient.patientId} className="border border-gray-200 rounded-lg p-3">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-medium text-gray-900">
                        {patient.firstName} {patient.lastName}
                      </h3>
                      <p className="text-sm text-gray-600">{patient.identifierNumber}</p>
                      <p className="text-xs text-gray-500">{patient.mobileNumber}</p>
                    </div>
                    <div className="text-xs text-gray-500">
                      {patient.email}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Notifications */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
              <Bell className="mr-2 text-indigo-600" size={20} />
              Recent Notifications ({mockNotifications.length})
            </h2>
            <div className="space-y-3">
              {mockNotifications.map((notification) => (
                <div key={notification.notificationId} className="border border-gray-200 rounded-lg p-3">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-medium text-gray-900">{notification.title}</h3>
                      <p className="text-sm text-gray-600">{notification.message}</p>
                      <p className="text-xs text-gray-500">
                        To: {notification.recipientName} via {notification.type}
                      </p>
                    </div>
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                      notification.status === 'Delivered' ? 'bg-green-100 text-green-800' :
                      notification.status === 'Sent' ? 'bg-blue-100 text-blue-800' :
                      notification.status === 'Failed' ? 'bg-red-100 text-red-800' :
                      'bg-yellow-100 text-yellow-800'
                    }`}>
                      {notification.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Audit Trail */}
        <div className="mt-8 bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
            <Shield className="mr-2 text-indigo-600" size={20} />
            Recent Audit Activities ({mockAuditTrails.length})
          </h2>
          <div className="space-y-3">
            {mockAuditTrails.map((audit) => (
              <div key={audit.auditId} className="border border-gray-200 rounded-lg p-3">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-medium text-gray-900">
                      {audit.action} - {audit.entityType} {audit.entityId}
                    </h3>
                    <p className="text-sm text-gray-600">{audit.description}</p>
                    <p className="text-xs text-gray-500">
                      By: {audit.performedByName} at {new Date(audit.timestamp).toLocaleString()}
                    </p>
                  </div>
                  <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                    audit.action === 'Create' ? 'bg-green-100 text-green-800' :
                    audit.action === 'Update' ? 'bg-blue-100 text-blue-800' :
                    audit.action === 'Delete' ? 'bg-red-100 text-red-800' :
                    'bg-gray-100 text-gray-800'
                  }`}>
                    {audit.action}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="mt-8 text-center">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">
              🚀 Ready to Test!
            </h2>
            <p className="text-gray-600 mb-4">
              All mock data is loaded and ready. You can now test the full appointments module.
            </p>
            <div className="space-x-4">
              <button
                onClick={() => window.location.href = '/appointments'}
                className="px-6 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
              >
                Go to Appointments Page
              </button>
              <button
                onClick={loadTestData}
                className="px-6 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50"
              >
                Refresh Data
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AppointmentTestPage;
