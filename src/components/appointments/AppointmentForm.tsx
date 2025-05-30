import React, { useState, useEffect } from "react";
import { FormField } from "../../commonfields/FormField";
import { Input } from "../../commonfields/Input";
import { Select } from "../../commonfields/Select";
import { Calendar } from "../../commonfields/Calendar";
import { Button } from "../../commonfields/Button";
// Import from mock service
import { searchPatients } from "../../services/mockService";
import { sendNotification } from "../../services/mockService";

const appointmentTypes = ["Initial Consultation", "Follow-up", "Procedure", "Emergency", "Routine Checkup"];

const AppointmentForm = ({ providerId, initialSlot, appointment, onSubmit, onCancel }) => {
  const [form, setForm] = useState({
    providerId: providerId,
    patientId: "",
    patientName: "",
    startTime: initialSlot?.start || new Date(),
    endTime: initialSlot?.end || new Date(Date.now() + 30 * 60000),
    appointmentType: "Initial Consultation",
    notes: "",
    status: "Scheduled",
    sendReminder: true
  });
  
  const [searchResults, setSearchResults] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [showPatientSearch, setShowPatientSearch] = useState(false);

  useEffect(() => {
    if (appointment) {
      setForm({
        providerId: appointment.providerId,
        patientId: appointment.patientId,
        patientName: appointment.patientName,
        startTime: appointment.start,
        endTime: appointment.end,
        appointmentType: appointment.appointmentType,
        notes: appointment.notes || "",
        status: appointment.status,
        sendReminder: true
      });
    }
  }, [appointment]);

  useEffect(() => {
    if (searchQuery.length > 2) {
      const delaySearch = setTimeout(() => {
        handlePatientSearch();
      }, 500);
      return () => clearTimeout(delaySearch);
    }
  }, [searchQuery]);

  const handlePatientSearch = async () => {
    const { success, data } = await searchPatients(searchQuery);
    if (success) {
      setSearchResults(data);
    }
  };

  const handleSelectPatient = (patient) => {
    setForm({
      ...form,
      patientId: patient.patientId,
      patientName: `${patient.firstName} ${patient.lastName}`
    });
    setShowPatientSearch(false);
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm({
      ...form,
      [name]: type === "checkbox" ? checked : value
    });
  };

  const handleDateTimeChange = (e) => {
    const { name, value } = e.target;
    setForm({
      ...form,
      [name]: new Date(value)
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Create audit trail entry
    const auditInfo = {
      timestamp: new Date(),
      action: appointment ? "UPDATE_APPOINTMENT" : "CREATE_APPOINTMENT",
      performedBy: "current-user-id", // This would come from auth context
      details: {
        appointmentId: appointment?.id,
        patientId: form.patientId,
        providerId: form.providerId
      }
    };
    
    // Prepare appointment data with audit
    const appointmentData = {
      ...form,
      audit: [...(appointment?.audit || []), auditInfo]
    };
    
    await onSubmit(appointmentData);
    
    // Send notification if reminder is enabled
    if (form.sendReminder) {
      await sendNotification({
        type: "APPOINTMENT",
        recipientId: form.patientId,
        message: `Your appointment with Dr. ${providerId} is scheduled for ${new Date(form.startTime).toLocaleString()}`,
        channel: "SMS" // or "EMAIL" or "BOTH"
      });
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <h2 className="text-xl font-semibold text-gray-800 mb-4">
        {appointment ? "Edit Appointment" : "Schedule New Appointment"}
      </h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <FormField label="Patient" required>
            <div className="relative">
              <Input
                value={form.patientName}
                onClick={() => setShowPatientSearch(true)}
                placeholder="Search for patient"
                readOnly
              />
              {showPatientSearch && (
                <div className="absolute z-10 mt-1 w-full bg-white border border-gray-200 rounded-md shadow-lg">
                  <div className="p-2">
                    <Input
                      placeholder="Type to search patients..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      autoFocus
                    />
                  </div>
                  <div className="max-h-60 overflow-y-auto">
                    {searchResults.map(patient => (
                      <div 
                        key={patient.patientId}
                        className="p-2 hover:bg-gray-100 cursor-pointer"
                        onClick={() => handleSelectPatient(patient)}
                      >
                        {patient.firstName} {patient.lastName} - {patient.phone || patient.email}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </FormField>
          
          <FormField label="Appointment Type" required>
            <Select name="appointmentType" value={form.appointmentType} onChange={handleChange}>
              {appointmentTypes.map(type => (
                <option key={type} value={type}>{type}</option>
              ))}
            </Select>
          </FormField>
          
          <FormField label="Status">
            <Select name="status" value={form.status} onChange={handleChange}>
              <option value="Scheduled">Scheduled</option>
              <option value="Confirmed">Confirmed</option>
              <option value="Cancelled">Cancelled</option>
              <option value="Completed">Completed</option>
              <option value="No-Show">No-Show</option>
            </Select>
          </FormField>
        </div>
        
        <div>
          <FormField label="Start Time" required>
            <input
              type="datetime-local"
              name="startTime"
              value={form.startTime instanceof Date ? form.startTime.toISOString().slice(0, 16) : form.startTime}
              onChange={handleDateTimeChange}
              className="input input-bordered input-sm w-full"
            />
          </FormField>
          
          <FormField label="End Time" required>
            <input
              type="datetime-local"
              name="endTime"
              value={form.endTime instanceof Date ? form.endTime.toISOString().slice(0, 16) : form.endTime}
              onChange={handleDateTimeChange}
              className="input input-bordered input-sm w-full"
            />
          </FormField>
          
          <FormField label="Send Reminder">
            <div className="flex items-center">
              <input
                type="checkbox"
                name="sendReminder"
                checked={form.sendReminder}
                onChange={handleChange}
                className="checkbox checkbox-sm"
              />
              <span className="ml-2 text-sm text-gray-600">Send notification to patient</span>
            </div>
          </FormField>
        </div>
      </div>
      
      <FormField label="Notes">
        <textarea
          name="notes"
          value={form.notes}
          onChange={handleChange}
          className="textarea textarea-bordered w-full h-24"
          placeholder="Add any notes about this appointment"
        />
      </FormField>
      
      <div className="flex justify-end space-x-4 mt-6">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit" variant="primary">
          {appointment ? "Update Appointment" : "Schedule Appointment"}
        </Button>
      </div>
    </form>
  );
};

export default AppointmentForm;

