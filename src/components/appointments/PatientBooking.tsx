import React, { useState, useEffect } from "react";
import { Calendar, Clock, User, Search } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { appointmentSchema, type AppointmentFormData } from "../../zod_validations/appointment/appointmentSchema";
import { FormField } from "../../commonfields/FormField";
import { Input } from "../../commonfields/Input";
import { Select } from "../../commonfields/Select";
import { Calendar as CalendarInput } from "../../commonfields/Calendar";
import { Button } from "../../commonfields/Button";
import FormMessage from "../../commonfields/FormMessage";
import { getProviders, getAvailableProviders } from "../../services/providerApis";
import { getAvailableSlots, createAppointment } from "../../services/appointmentApis";
import { sendAppointmentConfirmation } from "../../services/notificationApis";
import {
  appointmentTypeOptions,
  appointmentPriorityOptions,
  providerSpecializationOptions,
  SlotDuration,
  AppointmentType,
  AppointmentPriority
} from "../../types/appointmentenums";
import { showError, showSuccess } from "../../utils/toastUtils";
import type { Provider } from "../../types/provider";
import type { TimeSlot } from "../../types/appointment";

interface PatientBookingProps {
  patientId: string;
  facilityId?: string;
  onSuccess?: () => void;
}

export const PatientBooking: React.FC<PatientBookingProps> = ({
  patientId,
  facilityId,
  onSuccess
}) => {
  const [step, setStep] = useState(1); // 1: Select Provider, 2: Select Date/Time, 3: Confirm
  const [providers, setProviders] = useState<Provider[]>([]);
  const [selectedProvider, setSelectedProvider] = useState<Provider | null>(null);
  const [availableSlots, setAvailableSlots] = useState<TimeSlot[]>([]);
  const [selectedSlot, setSelectedSlot] = useState<TimeSlot | null>(null);
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedSpecialization, setSelectedSpecialization] = useState("");
  const [loading, setLoading] = useState(false);
  const [bookingLoading, setBookingLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch
  } = useForm<AppointmentFormData>({
    resolver: zodResolver(appointmentSchema),
    defaultValues: {
      patientId,
      facilityId: facilityId || "",
      type: AppointmentType.Consultation,
      priority: AppointmentPriority.Normal,
      duration: SlotDuration.Thirty
    }
  });

  useEffect(() => {
    loadProviders();
  }, [searchTerm, selectedSpecialization]);

  useEffect(() => {
    if (selectedProvider && selectedDate) {
      loadAvailableSlots();
    }
  }, [selectedProvider, selectedDate]);

  const loadProviders = async () => {
    setLoading(true);
    try {
      const filters = {
        facilityId,
        isActive: true,
        searchTerm: searchTerm || undefined,
        specialization: selectedSpecialization ? [selectedSpecialization] : undefined,
        size: 50
      };
      
      const response = await getProviders(filters);
      setProviders(response.results || []);
    } catch (error) {
      console.error("Failed to load providers:", error);
      showError("Failed to load providers");
    } finally {
      setLoading(false);
    }
  };

  const loadAvailableSlots = async () => {
    if (!selectedProvider) return;
    
    setLoading(true);
    try {
      const slots = await getAvailableSlots(selectedProvider.providerId, selectedDate);
      setAvailableSlots(slots);
    } catch (error) {
      console.error("Failed to load available slots:", error);
      showError("Failed to load available time slots");
    } finally {
      setLoading(false);
    }
  };

  const handleProviderSelect = (provider: Provider) => {
    setSelectedProvider(provider);
    setValue("providerId", provider.providerId);
    setStep(2);
  };

  const handleSlotSelect = (slot: TimeSlot) => {
    setSelectedSlot(slot);
    setValue("appointmentDate", selectedDate);
    setValue("startTime", slot.startTime);
    setValue("endTime", slot.endTime);
    setStep(3);
  };

  const handleBookAppointment = async (data: AppointmentFormData) => {
    setBookingLoading(true);
    try {
      const result = await createAppointment(data);
      if (result.success) {
        // Send confirmation notification
        await sendAppointmentConfirmation(result.data.appointmentId);
        
        showSuccess("Appointment booked successfully! You will receive a confirmation notification.");
        onSuccess?.();
      } else {
        showError(result.error || "Failed to book appointment");
      }
    } catch (error) {
      console.error("Booking error:", error);
      showError("An unexpected error occurred while booking the appointment");
    } finally {
      setBookingLoading(false);
    }
  };

  const renderStepIndicator = () => (
    <div className="flex items-center justify-center mb-8">
      {[1, 2, 3].map((stepNumber) => (
        <React.Fragment key={stepNumber}>
          <div className={`flex items-center justify-center w-8 h-8 rounded-full ${
            step >= stepNumber ? 'bg-indigo-600 text-white' : 'bg-gray-200 text-gray-600'
          }`}>
            {stepNumber}
          </div>
          {stepNumber < 3 && (
            <div className={`w-16 h-1 ${
              step > stepNumber ? 'bg-indigo-600' : 'bg-gray-200'
            }`} />
          )}
        </React.Fragment>
      ))}
    </div>
  );

  const renderProviderSelection = () => (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-800 mb-2">Select a Provider</h2>
        <p className="text-gray-600">Choose the healthcare provider you'd like to see</p>
      </div>

      {/* Search and Filter */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
          <Input
            placeholder="Search providers..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <Select
          value={selectedSpecialization}
          onChange={(e) => setSelectedSpecialization(e.target.value)}
        >
          <option value="">All Specializations</option>
          {providerSpecializationOptions.map((spec) => (
            <option key={spec} value={spec}>{spec}</option>
          ))}
        </Select>
      </div>

      {/* Provider List */}
      {loading ? (
        <div className="text-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600 mx-auto"></div>
          <p className="mt-2 text-gray-600">Loading providers...</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {providers.map((provider) => (
            <div
              key={provider.providerId}
              onClick={() => handleProviderSelect(provider)}
              className="p-4 border border-gray-200 rounded-lg hover:border-indigo-300 hover:shadow-md cursor-pointer transition-all"
            >
              <div className="flex items-center space-x-3">
                <div className="bg-indigo-100 p-2 rounded-full">
                  <User className="text-indigo-600" size={20} />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-800">
                    {provider.title} {provider.firstName} {provider.lastName}
                  </h3>
                  <p className="text-sm text-gray-600">{provider.specialization}</p>
                  <p className="text-xs text-gray-500">{provider.experience} years experience</p>
                  {provider.consultationFee && (
                    <p className="text-sm text-green-600 font-medium">
                      ₹{provider.consultationFee}
                    </p>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {!loading && providers.length === 0 && (
        <div className="text-center py-8">
          <User className="mx-auto text-gray-400 mb-4" size={48} />
          <h3 className="text-lg font-medium text-gray-600 mb-2">No providers found</h3>
          <p className="text-gray-500">Try adjusting your search criteria</p>
        </div>
      )}
    </div>
  );

  const renderDateTimeSelection = () => (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-800 mb-2">Select Date & Time</h2>
        <p className="text-gray-600">
          Choose an available time slot with {selectedProvider?.firstName} {selectedProvider?.lastName}
        </p>
      </div>

      {/* Selected Provider Info */}
      <div className="bg-gray-50 p-4 rounded-lg">
        <div className="flex items-center space-x-3">
          <div className="bg-indigo-100 p-2 rounded-full">
            <User className="text-indigo-600" size={20} />
          </div>
          <div>
            <h3 className="font-semibold text-gray-800">
              {selectedProvider?.title} {selectedProvider?.firstName} {selectedProvider?.lastName}
            </h3>
            <p className="text-sm text-gray-600">{selectedProvider?.specialization}</p>
          </div>
        </div>
      </div>

      {/* Date Selection */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Select Date
        </label>
        <CalendarInput
          value={selectedDate}
          onChange={(e) => setSelectedDate(e.target.value)}
          min={new Date().toISOString().split('T')[0]}
        />
      </div>

      {/* Time Slots */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Available Time Slots
        </label>
        {loading ? (
          <div className="text-center py-4">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-indigo-600 mx-auto"></div>
            <p className="mt-2 text-sm text-gray-600">Loading slots...</p>
          </div>
        ) : availableSlots.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
            {availableSlots.filter(slot => slot.isAvailable).map((slot, index) => (
              <button
                key={index}
                onClick={() => handleSlotSelect(slot)}
                className="p-3 border border-gray-200 rounded-lg hover:border-indigo-300 hover:bg-indigo-50 transition-colors"
              >
                <div className="flex items-center justify-center space-x-1">
                  <Clock size={14} />
                  <span className="text-sm font-medium">
                    {slot.startTime} - {slot.endTime}
                  </span>
                </div>
              </button>
            ))}
          </div>
        ) : (
          <div className="text-center py-8">
            <Calendar className="mx-auto text-gray-400 mb-4" size={48} />
            <h3 className="text-lg font-medium text-gray-600 mb-2">No available slots</h3>
            <p className="text-gray-500">Please select a different date</p>
          </div>
        )}
      </div>

      {/* Back Button */}
      <div className="flex justify-start">
        <Button
          onClick={() => setStep(1)}
          className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50"
        >
          Back to Provider Selection
        </Button>
      </div>
    </div>
  );

  const renderConfirmation = () => (
    <form onSubmit={handleSubmit(handleBookAppointment)} className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-800 mb-2">Confirm Appointment</h2>
        <p className="text-gray-600">Review your appointment details and confirm booking</p>
      </div>

      {/* Appointment Summary */}
      <div className="bg-gray-50 p-6 rounded-lg space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">Provider</label>
          <p className="text-gray-900">
            {selectedProvider?.title} {selectedProvider?.firstName} {selectedProvider?.lastName}
          </p>
          <p className="text-sm text-gray-600">{selectedProvider?.specialization}</p>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Date</label>
            <p className="text-gray-900">{new Date(selectedDate).toLocaleDateString()}</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Time</label>
            <p className="text-gray-900">
              {selectedSlot?.startTime} - {selectedSlot?.endTime}
            </p>
          </div>
        </div>
      </div>

      {/* Additional Details */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <FormField label="Appointment Type" required>
          <Select {...register("type")}>
            {appointmentTypeOptions.map((type) => (
              <option key={type} value={type}>{type}</option>
            ))}
          </Select>
          <FormMessage>{errors.type?.message}</FormMessage>
        </FormField>

        <FormField label="Priority">
          <Select {...register("priority")}>
            {appointmentPriorityOptions.map((priority) => (
              <option key={priority} value={priority}>{priority}</option>
            ))}
          </Select>
          <FormMessage>{errors.priority?.message}</FormMessage>
        </FormField>
      </div>

      <FormField label="Reason for Visit">
        <Input {...register("reason")} placeholder="Brief description of your concern" />
        <FormMessage>{errors.reason?.message}</FormMessage>
      </FormField>

      <FormField label="Additional Notes">
        <textarea
          {...register("notes")}
          className="w-full px-3 py-2 text-sm rounded-md border border-gray-300 focus:border-black focus:ring-1 focus:ring-black focus:outline-none"
          rows={3}
          placeholder="Any additional information"
        />
        <FormMessage>{errors.notes?.message}</FormMessage>
      </FormField>

      {/* Action Buttons */}
      <div className="flex justify-between">
        <Button
          type="button"
          onClick={() => setStep(2)}
          className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50"
        >
          Back
        </Button>
        <Button
          type="submit"
          disabled={bookingLoading}
          className="px-6 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 disabled:opacity-50"
        >
          {bookingLoading ? "Booking..." : "Confirm Appointment"}
        </Button>
      </div>
    </form>
  );

  return (
    <div className="max-w-4xl mx-auto p-6">
      {renderStepIndicator()}
      
      {step === 1 && renderProviderSelection()}
      {step === 2 && renderDateTimeSelection()}
      {step === 3 && renderConfirmation()}
    </div>
  );
};
