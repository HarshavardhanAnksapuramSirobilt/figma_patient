import React, { useState } from "react";
import {
    handleChange,
    handleArrayChange,
} from '../../hooks/useFormHandlers';
import { defaultPatientRegistrationPayload } from "../../types/patient";
import type { PatientRegistrationPayload } from '../../types/patient';
import { FormField } from '../../../src/commonfields/FormField';
import { Input } from "../../../src/commonfields/Input";
import { Select } from "../../../src/commonfields/Select";
import { Calendar } from "../../../src/commonfields/Calendar";
import { Button } from "../../../src/commonfields/Button";
import {
    titleOptions,
    genderOptions,
    relationTypeOptions,
    identifierTypeOptions
} from "../../types/patientenums";
import { Link } from "react-router-dom";
import { createPatient } from "../../services/patientApis";


type Props = {
    onClose: () => void;
};

export const RegisterPatientDrawer: React.FC<Props> = ({ onClose }) => {
    const [form, setForm] = useState<PatientRegistrationPayload>(defaultPatientRegistrationPayload);

    const onBasicChange = handleChange(setForm);
    const onContactChange = handleArrayChange(setForm, "contacts", 0);
    const onEmergencyChange = handleArrayChange(setForm, "emergencyContacts", 0);

    // const handleSubmit = (e: React.FormEvent) => {
    //     e.preventDefault();
    //     console.log("Quick Registration Form:", form);
    //     // Add validation + API integration here
    // };
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        console.log("Full Patient Form:", form);
        const { success, data, error } = await createPatient(form);
        if (success) {
            console.log("Patient created successfully:", data);
        } else {
            console.error("Error creating patient:", error);
        }
    };

    return (
        <div className="fixed top-0 right-0 w-full max-w-md h-full bg-white shadow-lg z-50 p-6 overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-semibold">Quick Register Patient</h2>
                <button onClick={onClose} className="text-xl font-bold">&times;</button>
            </div>

            <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField label="Title" required>
                    <Select name="title" value={form.title || ""} onChange={onBasicChange}>
                        <option value="">Select</option>
                        {titleOptions.map((t) => (
                            <option key={t} value={t}>{t}</option>
                        ))}
                    </Select>
                </FormField>

                <FormField label="First Name" required>
                    <Input name="firstName" value={form.firstName || ""} onChange={onBasicChange} />
                </FormField>

                <FormField label="Middle Name">
                    <Input name="middleName" value={form.middleName || ""} onChange={onBasicChange} />
                </FormField>

                <FormField label="Last Name" required>
                    <Input name="lastName" value={form.lastName || ""} onChange={onBasicChange} />
                </FormField>

                <FormField label="Date of Birth" required>
                    <Calendar name="dateOfBirth" value={form.dateOfBirth || ""} onChange={onBasicChange} />
                </FormField>

                <FormField label="Gender" required>
                    <Select name="gender" value={form.gender || ""} onChange={onBasicChange}>
                        <option value="">Select</option>
                        {genderOptions.map((g) => (
                            <option key={g} value={g}>{g}</option>
                        ))}
                    </Select>
                </FormField>

                <FormField label="Phone Number" required>
                    <Input
                        name="phoneNumber"
                        value={form.contacts?.[0]?.phoneNumber || ""}
                        onChange={onContactChange}
                    />
                </FormField>

                <FormField label="Emergency Contact Name" required>
                    <Input
                        name="contactName"
                        value={form.emergencyContacts?.[0]?.contactName || ""}
                        onChange={onEmergencyChange}
                    />
                </FormField>

                <FormField label="Relationship" required>
                    <Select
                        name="relationship"
                        value={form.emergencyContacts?.[0]?.relationship || ""}
                        onChange={onEmergencyChange}
                    >
                        <option value="">Select</option>
                        {relationTypeOptions.map((r) => (
                            <option key={r} value={r}>{r}</option>
                        ))}
                    </Select>
                </FormField>

                <FormField label="Emergency Phone Number" required>
                    <Input
                        name="phoneNumber"
                        value={form.emergencyContacts?.[0]?.phoneNumber || ""}
                        onChange={onEmergencyChange}
                    />
                </FormField>
                <FormField label="Identifier Type" required>
                    <Select
                        name="identifierType"
                        value={form.identifierType || ""}
                        onChange={onBasicChange}
                    >
                        <option value="">Select</option>
                        {identifierTypeOptions.map(type => (
                            <option key={type} value={type}>{type}</option>
                        ))}
                    </Select>
                </FormField>

                <FormField label="Identifier Number" required>
                    <Input
                        name="identifierNumber"
                        value={form.identifierNumber || ""}
                        onChange={onBasicChange}
                        placeholder="Enter identifier value"
                    />
                </FormField>

                <div className="col-span-2 mt-2">
                    <Link to="/patients" className="text-sm text-blue-600 hover:underline" onClick={onClose}>
                        + Add more details
                    </Link>
                </div>


                {/* Footer Buttons */}
                <div className="flex gap-4 mt-6">
                    <Button type="submit" variant="primary">
                        Register Patient
                    </Button>
                    <Button type="button" variant="outline" onClick={onClose}>
                        Cancel
                    </Button>
                </div>
            </form>


        </div>
    );
};
