import React, { useState, useEffect } from "react";
import { Calendar, momentLocalizer } from "react-big-calendar";
import moment from "moment";
import "react-big-calendar/lib/css/react-big-calendar.css";
// Import from mock service instead of real API
import { createAppointment, getAppointments, updateAppointment } from "../services/mockService";
import AppointmentForm from "../components/appointments/AppointmentForm";
import ProviderList from "../components/appointments/ProviderList";
import { showSuccess } from "../utils/toastUtils";

const localizer = momentLocalizer(moment);

const AppointmentsPage = () => {
  const [appointments, setAppointments] = useState([]);
  const [selectedProvider, setSelectedProvider] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [selectedAppointment, setSelectedAppointment] = useState(null);

  useEffect(() => {
    fetchAppointments();
  }, [selectedProvider]);

  const fetchAppointments = async () => {
    if (selectedProvider) {
      const { success, data } = await getAppointments(selectedProvider.id);
      if (success) {
        const formattedAppointments = data.map(apt => ({
          ...apt,
          start: new Date(apt.startTime),
          end: new Date(apt.endTime),
          title: `${apt.patientName} - ${apt.appointmentType}`
        }));
        setAppointments(formattedAppointments);
      }
    }
  };

  const handleSelectSlot = ({ start, end }) => {
    setSelectedSlot({ start, end });
    setSelectedAppointment(null);
    setShowForm(true);
  };

  const handleSelectEvent = (event) => {
    setSelectedAppointment(event);
    setSelectedSlot(null);
    setShowForm(true);
  };

  const handleFormSubmit = async (appointmentData) => {
    const { success } = selectedAppointment 
      ? await updateAppointment(selectedAppointment.id, appointmentData)
      : await createAppointment(appointmentData);
    
    if (success) {
      showSuccess("Appointment saved successfully");
      setShowForm(false);
      fetchAppointments();
    }
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <h1 className="text-2xl font-bold mb-6 text-gray-800">📅 Appointment Management</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="md:col-span-1 bg-white p-4 rounded-xl shadow-md">
          <h2 className="font-semibold text-gray-700 mb-4">Providers</h2>
          <ProviderList onSelectProvider={setSelectedProvider} selectedProvider={selectedProvider} />
        </div>
        
        <div className="md:col-span-3 bg-white p-4 rounded-xl shadow-md">
          {selectedProvider ? (
            <Calendar
              localizer={localizer}
              events={appointments}
              startAccessor="start"
              endAccessor="end"
              style={{ height: 600 }}
              selectable
              onSelectSlot={handleSelectSlot}
              onSelectEvent={handleSelectEvent}
              step={15}
              timeslots={4}
              defaultView="week"
            />
          ) : (
            <div className="flex items-center justify-center h-96 text-gray-500">
              Please select a provider to view their calendar
            </div>
          )}
        </div>
      </div>

      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-xl shadow-lg w-full max-w-2xl">
            <AppointmentForm 
              providerId={selectedProvider?.id}
              initialSlot={selectedSlot}
              appointment={selectedAppointment}
              onSubmit={handleFormSubmit}
              onCancel={() => setShowForm(false)}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default AppointmentsPage;

