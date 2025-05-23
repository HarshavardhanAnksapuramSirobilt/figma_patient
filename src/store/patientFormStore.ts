import { create } from "zustand";
import type { PatientRegistrationPayload } from "../types/patient";
import { defaultPatientRegistrationPayload } from "../types/patient";

type PatientFormState = {
  quickFormData: PatientRegistrationPayload;
  setQuickFormData: (data: PatientRegistrationPayload) => void;
  clearQuickFormData: () => void;
};

export const usePatientFormStore = create<PatientFormState>((set) => ({
  quickFormData: defaultPatientRegistrationPayload,
  setQuickFormData: (data) => set({ quickFormData: data }),
  clearQuickFormData: () => set({ quickFormData: defaultPatientRegistrationPayload }),
}));
