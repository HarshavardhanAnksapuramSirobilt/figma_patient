import React, { useState, useEffect } from "react";
import { Calendar, momentLocalizer, Views } from "react-big-calendar";
import type { View } from "react-big-calendar";
import moment from "moment";
import "react-big-calendar/lib/css/react-big-calendar.css";
import { useAppointmentStore } from "../../store/appointmentStore";
import { useProviderStore } from "../../store/providerStore";
import { getAppointments } from "../../services/appointmentApis";
import { getProviders } from "../../services/providerApis";
import { AppointmentStatus } from "../../types/appointmentenums";
import type { Appointment } from "../../types/appointment";
import { showError } from "../../utils/toastUtils";

const localizer = momentLocalizer(moment);

interface CalendarEvent {
  id: string;
  title: string;
  start: Date;
  end: Date;
  resource: Appointment;
  color?: string;
}

interface AppointmentCalendarProps {
  onSelectAppointment?: (appointment: Appointment) => void;
  onSelectSlot?: (slotInfo: { start: Date; end: Date; slots: Date[] }) => void;
  selectedProviderId?: string;
  facilityId?: string;
  view?: View;
}

export const AppointmentCalendar: React.FC<AppointmentCalendarProps> = ({
  onSelectAppointment,
  onSelectSlot,
  selectedProviderId,
  facilityId,
  view = Views.WEEK
}) => {
  const [currentView, setCurrentView] = useState<View>(view);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [loading, setLoading] = useState(false);

  const { setAppointments } = useAppointmentStore();
  const { setProviders } = useProviderStore();

  useEffect(() => {
    loadAppointments();
    loadProviders();
  }, [currentDate, currentView, selectedProviderId, facilityId]);

  const loadAppointments = async () => {
    setLoading(true);
    try {
      // Calculate date range based on current view
      const { start, end } = getDateRange(currentDate, currentView);
      
      const filters = {
        dateFrom: start.toISOString().split('T')[0],
        dateTo: end.toISOString().split('T')[0],
        providerId: selectedProviderId,
        facilityId,
        size: 1000
      };

      const response = await getAppointments(filters);
      const appointmentData = response.results || [];
      
      setAppointments(appointmentData);
      
      // Convert appointments to calendar events
      const calendarEvents: CalendarEvent[] = appointmentData.map((appointment: Appointment) => ({
        id: appointment.appointmentId!,
        title: getEventTitle(appointment),
        start: new Date(`${appointment.appointmentDate}T${appointment.startTime}`),
        end: new Date(`${appointment.appointmentDate}T${appointment.endTime}`),
        resource: appointment,
        color: getEventColor(appointment)
      }));
      
      setEvents(calendarEvents);
    } catch (error) {
      console.error("Failed to load appointments:", error);
      showError("Failed to load appointments");
    } finally {
      setLoading(false);
    }
  };

  const loadProviders = async () => {
    try {
      const response = await getProviders({ facilityId, isActive: true, size: 100 });
      setProviders(response.results || []);
    } catch (error) {
      console.error("Failed to load providers:", error);
    }
  };

  const getDateRange = (date: Date, view: View) => {
    const start = moment(date).startOf(view === Views.MONTH ? 'month' : 'week').toDate();
    const end = moment(date).endOf(view === Views.MONTH ? 'month' : 'week').toDate();
    return { start, end };
  };

  const getEventTitle = (appointment: Appointment): string => {
    const patientName = appointment.patient 
      ? `${appointment.patient.firstName} ${appointment.patient.lastName}`
      : 'Unknown Patient';
    
    const providerName = appointment.provider
      ? `${appointment.provider.title} ${appointment.provider.lastName}`
      : 'Unknown Provider';

    return `${patientName} - ${providerName}`;
  };

  const getEventColor = (appointment: Appointment): string => {
    switch (appointment.status) {
      case AppointmentStatus.Scheduled:
        return '#3b82f6'; // Blue
      case AppointmentStatus.Confirmed:
        return '#10b981'; // Green
      case AppointmentStatus.InProgress:
        return '#f59e0b'; // Yellow
      case AppointmentStatus.Completed:
        return '#6b7280'; // Gray
      case AppointmentStatus.Cancelled:
        return '#ef4444'; // Red
      case AppointmentStatus.NoShow:
        return '#dc2626'; // Dark Red
      case AppointmentStatus.Rescheduled:
        return '#8b5cf6'; // Purple
      default:
        return '#6b7280'; // Default Gray
    }
  };

  const handleSelectEvent = (event: CalendarEvent) => {
    onSelectAppointment?.(event.resource);
  };

  const handleSelectSlot = (slotInfo: { start: Date; end: Date; slots: Date[] }) => {
    onSelectSlot?.(slotInfo);
  };

  const handleNavigate = (date: Date) => {
    setCurrentDate(date);
  };

  const handleViewChange = (view: View) => {
    setCurrentView(view);
  };

  const eventStyleGetter = (event: CalendarEvent) => {
    return {
      style: {
        backgroundColor: event.color,
        borderColor: event.color,
        color: 'white',
        border: 'none',
        borderRadius: '4px',
        fontSize: '12px'
      }
    };
  };

  const dayPropGetter = (date: Date) => {
    const isToday = moment(date).isSame(moment(), 'day');
    const isPast = moment(date).isBefore(moment(), 'day');
    
    return {
      style: {
        backgroundColor: isToday ? '#f0f9ff' : isPast ? '#f9fafb' : 'white'
      }
    };
  };

  return (
    <div className="h-full">
      {loading && (
        <div className="absolute inset-0 bg-white bg-opacity-75 flex items-center justify-center z-10">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600 mx-auto"></div>
            <p className="mt-2 text-sm text-gray-600">Loading appointments...</p>
          </div>
        </div>
      )}
      
      <Calendar
        localizer={localizer}
        events={events}
        startAccessor="start"
        endAccessor="end"
        style={{ height: '100%', minHeight: '600px' }}
        view={currentView}
        date={currentDate}
        onNavigate={handleNavigate}
        onView={handleViewChange}
        onSelectEvent={handleSelectEvent}
        onSelectSlot={handleSelectSlot}
        selectable
        eventPropGetter={eventStyleGetter}
        dayPropGetter={dayPropGetter}
        step={15}
        timeslots={4}
        defaultView={Views.WEEK}
        views={[Views.MONTH, Views.WEEK, Views.DAY, Views.AGENDA]}
        popup
        showMultiDayTimes
        messages={{
          next: "Next",
          previous: "Previous",
          today: "Today",
          month: "Month",
          week: "Week",
          day: "Day",
          agenda: "Agenda",
          date: "Date",
          time: "Time",
          event: "Appointment",
          noEventsInRange: "No appointments in this range",
          showMore: (total: number) => `+${total} more`
        }}
        formats={{
          timeGutterFormat: 'HH:mm',
          eventTimeRangeFormat: ({ start, end }) => 
            `${moment(start).format('HH:mm')} - ${moment(end).format('HH:mm')}`,
          agendaTimeFormat: 'HH:mm',
          agendaTimeRangeFormat: ({ start, end }) => 
            `${moment(start).format('HH:mm')} - ${moment(end).format('HH:mm')}`
        }}
      />
    </div>
  );
};
