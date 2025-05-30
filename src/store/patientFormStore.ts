import { create } from "zustand";
import type { PatientRegistrationPayload } from "../types/patient";

interface PatientFormState {
  quickFormData: Partial<PatientRegistrationPayload> | null;
  setQuickFormData: (data: Partial<PatientRegistrationPayload>) => void;
  clearQuickFormData: () => void;
};

export const usePatientFormStore = create<PatientFormState>((set) => ({
  quickFormData: null,
  setQuickFormData: (data) => set({ quickFormData: data }),
  clearQuickFormData: () => set({ quickFormData: null }),
}));
