import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { appointmentSchema, type AppointmentFormData } from "../../zod_validations/appointment/appointmentSchema";
import { FormField } from "../../commonfields/FormField";
import { Input } from "../../commonfields/Input";
import { Select } from "../../commonfields/Select";
import { Calendar } from "../../commonfields/Calendar";
import { Button } from "../../commonfields/Button";
import FormMessage from "../../commonfields/FormMessage";
import FacilitySelector from "../../commonfields/FacilitySelector";
import {
  appointmentTypeOptions,
  appointmentPriorityOptions,
  slotDurationOptions,
  recurringPatternOptions,
  SlotDuration,
  AppointmentType,
  AppointmentPriority,
  RecurringPattern
} from "../../types/appointmentenums";
import { createAppointment, updateAppointment } from "../../services/appointmentApis";
import { getProviders } from "../../services/providerApis";
import { getAllPatients } from "../../services/patientApis";
import { showError, showSuccess } from "../../utils/toastUtils";
import { useAppointmentStore } from "../../store/appointmentStore";
import type { Appointment } from "../../types/appointment";

interface AppointmentFormProps {
  appointmentId?: string;
  initialData?: Partial<Appointment>;
  onSuccess?: () => void;
  onCancel?: () => void;
}

export const AppointmentForm: React.FC<AppointmentFormProps> = ({
  appointmentId,
  initialData,
  onSuccess,
  onCancel
}) => {
  const [loading, setLoading] = useState(false);
  const [providers, setProviders] = useState<any[]>([]);
  const [patients, setPatients] = useState<any[]>([]);
  const [loadingProviders, setLoadingProviders] = useState(false);
  const [loadingPatients, setLoadingPatients] = useState(false);

  const { addAppointment, updateAppointment: updateAppointmentInStore } = useAppointmentStore();
  const isEditMode = !!appointmentId;

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
    reset
  } = useForm<AppointmentFormData>({
    resolver: zodResolver(appointmentSchema),
    defaultValues: {
      patientId: initialData?.patientId || "",
      providerId: initialData?.providerId || "",
      facilityId: initialData?.facilityId || "",
      appointmentDate: initialData?.appointmentDate || "",
      startTime: initialData?.startTime || "",
      endTime: initialData?.endTime || "",
      duration: initialData?.duration || SlotDuration.Thirty,
      type: initialData?.type || AppointmentType.Consultation,
      priority: initialData?.priority || AppointmentPriority.Normal,
      title: initialData?.title || "",
      description: initialData?.description || "",
      notes: initialData?.notes || "",
      reason: initialData?.reason || "",
      isRecurring: initialData?.isRecurring || false,
      recurringPattern: initialData?.recurringPattern || RecurringPattern.None,
      recurringEndDate: initialData?.recurringEndDate || ""
    }
  });

  const watchIsRecurring = watch("isRecurring");
  const watchStartTime = watch("startTime");
  const watchDuration = watch("duration");

  // Load providers and patients on component mount
  useEffect(() => {
    loadProviders();
    loadPatients();
  }, []);

  // Auto-calculate end time when start time or duration changes
  useEffect(() => {
    if (watchStartTime && watchDuration) {
      const [hours, minutes] = watchStartTime.split(':').map(Number);
      const startMinutes = hours * 60 + minutes;
      const endMinutes = startMinutes + Number(watchDuration);
      const endHours = Math.floor(endMinutes / 60);
      const endMins = endMinutes % 60;
      const endTime = `${endHours.toString().padStart(2, '0')}:${endMins.toString().padStart(2, '0')}`;
      setValue("endTime", endTime);
    }
  }, [watchStartTime, watchDuration, setValue]);

  const loadProviders = async () => {
    setLoadingProviders(true);
    try {
      const response = await getProviders({ isActive: true, size: 100 });
      setProviders(response.results || []);
    } catch (error) {
      console.error("Failed to load providers:", error);
      showError("Failed to load providers");
    } finally {
      setLoadingProviders(false);
    }
  };

  const loadPatients = async () => {
    setLoadingPatients(true);
    try {
      const response = await getAllPatients();
      setPatients(response || []);
    } catch (error) {
      console.error("Failed to load patients:", error);
      showError("Failed to load patients");
    } finally {
      setLoadingPatients(false);
    }
  };

  const onSubmit = async (data: AppointmentFormData) => {
    setLoading(true);
    try {
      if (isEditMode && appointmentId) {
        const result = await updateAppointment(appointmentId, data);
        if (result.success) {
          updateAppointmentInStore(appointmentId, data);
          showSuccess("Appointment updated successfully");
          onSuccess?.();
        } else {
          showError(result.error || "Failed to update appointment");
        }
      } else {
        const result = await createAppointment(data);
        if (result.success) {
          addAppointment(result.data);
          showSuccess("Appointment created successfully");
          reset();
          onSuccess?.();
        } else {
          showError(result.error || "Failed to create appointment");
        }
      }
    } catch (error) {
      console.error("Appointment form error:", error);
      showError("An unexpected error occurred");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Patient Selection */}
        <FormField label="Patient" required>
          <Select {...register("patientId")} disabled={loadingPatients}>
            <option value="">Select Patient</option>
            {patients.map((patient) => (
              <option key={patient.patientId} value={patient.patientId}>
                {patient.firstName} {patient.lastName} - {patient.identifierNumber}
              </option>
            ))}
          </Select>
          <FormMessage>{errors.patientId?.message}</FormMessage>
        </FormField>

        {/* Provider Selection */}
        <FormField label="Provider" required>
          <Select {...register("providerId")} disabled={loadingProviders}>
            <option value="">Select Provider</option>
            {providers.map((provider) => (
              <option key={provider.providerId} value={provider.providerId}>
                {provider.title} {provider.firstName} {provider.lastName} - {provider.specialization}
              </option>
            ))}
          </Select>
          <FormMessage>{errors.providerId?.message}</FormMessage>
        </FormField>

        {/* Facility Selection */}
        <FormField label="Facility" required>
          <FacilitySelector
            value={watch("facilityId")}
            onChange={(value) => setValue("facilityId", value)}
            placeholder="Select Facility"
          />
          <FormMessage>{errors.facilityId?.message}</FormMessage>
        </FormField>

        {/* Appointment Date */}
        <FormField label="Appointment Date" required>
          <Calendar {...register("appointmentDate")} />
          <FormMessage>{errors.appointmentDate?.message}</FormMessage>
        </FormField>

        {/* Start Time */}
        <FormField label="Start Time" required>
          <Input {...register("startTime")} type="time" />
          <FormMessage>{errors.startTime?.message}</FormMessage>
        </FormField>

        {/* Duration */}
        <FormField label="Duration" required>
          <Select {...register("duration")}>
            {slotDurationOptions.map((duration) => (
              <option key={duration} value={duration}>
                {duration} minutes
              </option>
            ))}
          </Select>
          <FormMessage>{errors.duration?.message}</FormMessage>
        </FormField>

        {/* End Time (Auto-calculated, read-only) */}
        <FormField label="End Time">
          <Input {...register("endTime")} type="time" readOnly className="bg-gray-100" />
          <FormMessage>{errors.endTime?.message}</FormMessage>
        </FormField>

        {/* Appointment Type */}
        <FormField label="Type" required>
          <Select {...register("type")}>
            {appointmentTypeOptions.map((type) => (
              <option key={type} value={type}>
                {type}
              </option>
            ))}
          </Select>
          <FormMessage>{errors.type?.message}</FormMessage>
        </FormField>

        {/* Priority */}
        <FormField label="Priority" required>
          <Select {...register("priority")}>
            {appointmentPriorityOptions.map((priority) => (
              <option key={priority} value={priority}>
                {priority}
              </option>
            ))}
          </Select>
          <FormMessage>{errors.priority?.message}</FormMessage>
        </FormField>
      </div>

      {/* Additional Information */}
      <div className="space-y-4">
        <FormField label="Title">
          <Input {...register("title")} placeholder="Appointment title" />
          <FormMessage>{errors.title?.message}</FormMessage>
        </FormField>

        <FormField label="Description">
          <textarea
            {...register("description")}
            className="w-full px-3 py-2 text-sm rounded-md border border-gray-300 focus:border-black focus:ring-1 focus:ring-black focus:outline-none"
            rows={3}
            placeholder="Appointment description"
          />
          <FormMessage>{errors.description?.message}</FormMessage>
        </FormField>

        <FormField label="Reason">
          <Input {...register("reason")} placeholder="Reason for appointment" />
          <FormMessage>{errors.reason?.message}</FormMessage>
        </FormField>

        <FormField label="Notes">
          <textarea
            {...register("notes")}
            className="w-full px-3 py-2 text-sm rounded-md border border-gray-300 focus:border-black focus:ring-1 focus:ring-black focus:outline-none"
            rows={2}
            placeholder="Additional notes"
          />
          <FormMessage>{errors.notes?.message}</FormMessage>
        </FormField>
      </div>

      {/* Recurring Appointment Options */}
      <div className="space-y-4">
        <FormField label="">
          <label className="flex items-center space-x-2">
            <input
              {...register("isRecurring")}
              type="checkbox"
              className="form-checkbox h-4 w-4 text-indigo-600"
            />
            <span className="text-sm text-gray-700">Recurring Appointment</span>
          </label>
        </FormField>

        {watchIsRecurring && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField label="Recurring Pattern" required>
              <Select {...register("recurringPattern")}>
                {recurringPatternOptions.map((pattern) => (
                  <option key={pattern} value={pattern}>
                    {pattern}
                  </option>
                ))}
              </Select>
              <FormMessage>{errors.recurringPattern?.message}</FormMessage>
            </FormField>

            <FormField label="End Date" required>
              <Calendar {...register("recurringEndDate")} />
              <FormMessage>{errors.recurringEndDate?.message}</FormMessage>
            </FormField>
          </div>
        )}
      </div>

      {/* Form Actions */}
      <div className="flex justify-end space-x-4">
        {onCancel && (
          <Button
            type="button"
            onClick={onCancel}
            className="px-6 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50"
          >
            Cancel
          </Button>
        )}
        <Button
          type="submit"
          disabled={loading}
          className="px-6 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 disabled:opacity-50"
        >
          {loading ? "Saving..." : isEditMode ? "Update Appointment" : "Create Appointment"}
        </Button>
      </div>
    </form>
  );
};
