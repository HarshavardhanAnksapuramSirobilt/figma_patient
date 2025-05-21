import React, { useState, useEffect } from "react";
import {
    handleChange,
    handleObjectChange,
    handleArrayChange,
    addArrayItem,
    removeArrayItem,
} from "../../hooks/useFormHandlers";
import { defaultPatientRegistrationPayload } from "../../types/patient";
import type { PatientRegistrationPayload } from "../../types/patient";
import {
    titleOptions,
    genderOptions,
    bloodGroupOptions,
    maritalStatusOptions,
    contactModeOptions,
    phonePrefOptions,
    addressTypeOptions,
    relationTypeOptions,
    billingTypeOptions,
    identifierTypeOptions, citizenshipOptions, religionOptions, casteOptions, occupationOptions, educationOptions, annualIncomeOptions
} from "../../types/patientenums";
import { FormField } from "../../commonfields/FormField";
import { Input } from "../../commonfields/Input";
import { Select } from "../../commonfields/Select";
import { Calendar } from "../../commonfields/Calendar";
import { Button } from "../../commonfields/Button";
import { createPatient, getPatientById,updatePatient } from "../../services/patientApis";

type Props = {
    patientId?: string;
};

export const PatientRegistrationForm: React.FC<Props> = ({ patientId }) => {
    const [form, setForm] = useState<PatientRegistrationPayload>(
        defaultPatientRegistrationPayload
    );
    const [loading, setLoading] = useState(false);

    const onChange = handleChange(setForm);
    const onContactChange = (index: number) => handleArrayChange(setForm, "contacts", index);
    const onAddressChange = (index: number) => handleArrayChange(setForm, "addresses", index);
    const onEmergencyChange = (index: number) => handleArrayChange(setForm, "emergencyContacts", index);
    const onReferralChange = (index: number) => handleArrayChange(setForm, "referrals", index);
    const onRelationshipChange = (index: number) => handleArrayChange(setForm, "relationships", index);
    const onTokenChange = (index: number) => handleArrayChange(setForm, "tokens", index);
    const onObjectChange = (key: keyof PatientRegistrationPayload) => handleObjectChange(setForm, key);

    // const handleSubmit = (e: React.FormEvent) => {
    //     e.preventDefault();
    //     console.log("Full Patient Form:", form);
    // };
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        console.log("Full Patient Form:", form);

        if (patientId) {
            // 🟡 EDIT FLOW
            const { success, data, error } = await updatePatient(patientId, form);
            if (success) {
                console.log("Patient updated successfully:", data);
            } else {
                console.error("Error updating patient:", error);
            }
        } else {
            // 🟢 CREATE FLOW
            const { success, data, error } = await createPatient(form);
            if (success) {
                console.log("Patient created successfully:", data);
            } else {
                console.error("Error creating patient:", error);
            }
        }
    };


    useEffect(() => {
        if (form.dateOfBirth) {
            const birthDate = new Date(form.dateOfBirth);
            const today = new Date();
            let age = today.getFullYear() - birthDate.getFullYear();
            const m = today.getMonth() - birthDate.getMonth();
            if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
                age--;
            }

            setForm(prev => ({
                ...prev,
                age
            }));
        }
    }, [form.dateOfBirth]);

    useEffect(() => {
        const fetchPatient = async () => {
            if (!patientId) return;

            try {
                setLoading(true);
                const result = await getPatientById(patientId);
                if (Array.isArray(result) && result.length > 0) {
                    setForm(result[0]); // Take first object in array
                } else {
                    console.warn("No patient found for ID:", patientId);
                }
            } catch (error) {
                console.error("Error loading patient:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchPatient();
    }, [patientId]);


    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            <div className="text-center">
                <h2 className="text-2xl font-semibold">Patient Registration</h2>
            </div>
            <h2 className="text-xl font-semibold">Basic Info</h2>

            <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                <FormField label="Title" required>
                    <Select name="title" value={form.title || ""} onChange={onChange}>
                        <option value="">Select</option>
                        {titleOptions.map(t => <option key={t} value={t}>{t}</option>)}
                    </Select>
                </FormField>

                <FormField label="First Name" required>
                    <Input name="firstName" value={form.firstName || ""} onChange={onChange} />
                </FormField>

                <FormField label="Middle Name">
                    <Input name="middleName" value={form.middleName || ""} onChange={onChange} />
                </FormField>

                <FormField label="Last Name" required>
                    <Input name="lastName" value={form.lastName || ""} onChange={onChange} />
                </FormField>

                <FormField label="Date of Birth" required>
                    <Calendar name="dateOfBirth" value={form.dateOfBirth || ""} onChange={onChange} />
                </FormField>

                <FormField label="Age">
                    <Input
                        name="age"
                        value={form.age ?? ""}
                        readOnly
                    />
                </FormField>


                <FormField label="Gender" required>
                    <Select name="gender" value={form.gender || ""} onChange={onChange}>
                        <option value="">Select</option>
                        {genderOptions.map(g => <option key={g} value={g}>{g}</option>)}
                    </Select>
                </FormField>

                <FormField label="Blood Group">
                    <Select name="bloodGroup" value={form.bloodGroup || ""} onChange={onChange}>
                        <option value="">Select</option>
                        {bloodGroupOptions.map(bg => <option key={bg} value={bg}>{bg}</option>)}
                    </Select>
                </FormField>

                <FormField label="Marital Status">
                    <Select name="maritalStatus" value={form.maritalStatus || ""} onChange={onChange}>
                        <option value="">Select</option>
                        {maritalStatusOptions.map(ms => <option key={ms} value={ms}>{ms}</option>)}
                    </Select>
                </FormField>

                <FormField label="Identifier Type" required>
                    <Select
                        name="identifierType"
                        value={form.identifierType || ""}
                        onChange={onChange}
                    >
                        <option value="">Select</option>
                        {identifierTypeOptions.map((type) => (
                            <option key={type} value={type}>{type}</option>
                        ))}
                    </Select>
                </FormField>


                <FormField label="Identifier Number" required>
                    <Input name="identifierNumber" value={form.identifierNumber || ""} onChange={onChange} />
                </FormField>
            </div>

            {/* contacts */}
            <div>
                <div className="flex justify-between items-center mb-2">
                    <h3 className="text-lg font-semibold">Contacts</h3>
                    <div className="col-span-1 text-right">
                        <Button
                            type="button"
                            className="btn btn-sm btn-outline"
                            onClick={() => addArrayItem(setForm, "contacts", {})}
                        >
                            + Add
                        </Button>
                    </div>
                </div>

                {form.contacts?.map((contact, index) => (
                    <div key={index} className="grid grid-cols-1 md:grid-cols-5 gap-4 border p-4 mb-2">
                        <FormField label="Primary Phone Number" required>
                            <Input name="phoneNumber" value={contact.phoneNumber || ""} onChange={onContactChange(index)} />
                        </FormField>
                        <FormField label="Secondary Mobile Number">
                            <Input name="mobileNumber" value={contact.mobileNumber || ""} onChange={onContactChange(index)} />
                        </FormField>

                        <FormField label="Email">
                            <Input name="email" value={contact.email || ""} onChange={onContactChange(index)} />
                        </FormField>
                        <FormField label="Preferred Contact Mode">
                            <Select name="preferredContactMode" value={contact.preferredContactMode || ""} onChange={onContactChange(index)}>
                                <option value="">Select</option>
                                {contactModeOptions.map(mode => (
                                    <option key={mode} value={mode}>{mode}</option>
                                ))}
                            </Select>
                        </FormField>
                        <FormField label="Phone Contact Preference">
                            <Select name="phoneContactPreference" value={contact.phoneContactPreference || ""} onChange={onContactChange(index)}>
                                <option value="">Select</option>
                                {phonePrefOptions.map(p => (
                                    <option key={p} value={p}>{p}</option>
                                ))}
                            </Select>
                        </FormField>
                        <FormField label="Consent to Share">
                            <Select name="consentToShare" value={String(contact.consentToShare)} onChange={onContactChange(index)}>
                                <option value="true">Yes</option>
                                <option value="false">No</option>
                            </Select>
                        </FormField>

                        <div className="w-1/4 flex justify-end mt-4">
                            <Button
                                type="button"
                                className="btn btn-sm btn-outline text-red-600 border-red-500 hover:bg-red-50 w-auto"
                                onClick={() => removeArrayItem(setForm, "contacts", index)}
                            >
                                Remove
                            </Button>
                        </div>
                    </div>
                ))}
            </div>


            {/* Repeat similar pattern for addresses, emergencyContacts, referrals, relationships, tokens */}
            {/* Addresses */}
            <div>
                <div className="flex justify-between items-center mb-2">
                    <h3 className="text-lg font-semibold">Addresses</h3>
                    <div className="col-span-1 text-right">
                        <Button
                            type="button"
                            className="btn btn-sm btn-outline"
                            onClick={() => addArrayItem(setForm, "addresses", {})}
                        >
                            + Add
                        </Button>
                    </div>
                </div>

                {form.addresses?.map((address, index) => (
                    <div key={index} className="grid grid-cols-1 md:grid-cols-5 gap-4 border p-4 mb-2">
                        <FormField label="Address Type">
                            <Select name="addressType" value={address.addressType || ""} onChange={onAddressChange(index)}>
                                <option value="">Select</option>
                                {addressTypeOptions.map(type => (
                                    <option key={type} value={type}>{type}</option>
                                ))}
                            </Select>
                        </FormField>
                        <FormField label="House/Flat No">
                            <Input name="houseNoOrFlatNo" value={address.houseNoOrFlatNo || ""} onChange={onAddressChange(index)} />
                        </FormField>
                        <FormField label="Locality/Sector">
                            <Input name="localityOrSector" value={address.localityOrSector || ""} onChange={onAddressChange(index)} />
                        </FormField>
                        <FormField label="City/Village">
                            <Input name="cityOrVillage" value={address.cityOrVillage || ""} onChange={onAddressChange(index)} />
                        </FormField>
                        <FormField label="Pincode">
                            <Input name="pincode" value={address.pincode || ""} onChange={onAddressChange(index)} />
                        </FormField>
                        <FormField label="District">
                            <Input name="districtId" value={address.districtId || ""} onChange={onAddressChange(index)} />
                        </FormField>
                        <FormField label="State">
                            <Input name="stateId" value={address.stateId || ""} onChange={onAddressChange(index)} />
                        </FormField>
                        <FormField label="Country">
                            <Input name="country" value={address.country || ""} onChange={onAddressChange(index)} />
                        </FormField>
                        {/* <Button type="button" variant="outline" onClick={() => removeArrayItem(setForm, "addresses", index)}>Remove</Button> */}
                        <div className="w-1/4 flex justify-end mt-4">
                            <Button
                                type="button"
                                className="btn btn-sm btn-outline text-red-600 border-red-500 hover:bg-red-50 w-auto"
                                onClick={() => removeArrayItem(setForm, "addresses", index)}
                            >
                                Remove
                            </Button>
                        </div>

                    </div>
                ))}
            </div>

            {/* Emergency Contacts */}
            <div>
                <div className="flex justify-between items-center mb-2">
                    <h3 className="text-lg font-semibold">Emergency Contacts</h3>
                    <div className="col-span-1 text-right">
                        <Button
                            type="button"
                            className="btn btn-sm btn-outline"
                            onClick={() => addArrayItem(setForm, "emergencyContacts", {})}
                        >
                            + Add
                        </Button>
                    </div>
                </div>
                {form.emergencyContacts?.map((contact, index) => (
                    <div key={index} className="grid grid-cols-1 md:grid-cols-5 gap-4 border p-4 mb-2">
                        <FormField label="Contact Name">
                            <Input name="contactName" value={contact.contactName || ""} onChange={onEmergencyChange(index)} />
                        </FormField>
                        <FormField label="Relationship">
                            <Select name="relationship" value={contact.relationship || ""} onChange={onEmergencyChange(index)}>
                                <option value="">Select</option>
                                {relationTypeOptions.map(rel => (
                                    <option key={rel} value={rel}>{rel}</option>
                                ))}
                            </Select>
                        </FormField>
                        <FormField label="Phone Number">
                            <Input name="phoneNumber" value={contact.phoneNumber || ""} onChange={onEmergencyChange(index)} />
                        </FormField>

                        <div className="w-1/4 flex justify-end mt-4">
                            <Button
                                type="button"
                                className="btn btn-sm btn-outline text-red-600 border-red-500 hover:bg-red-50 w-auto"
                                onClick={() => removeArrayItem(setForm, "emergencyContacts", index)}
                            >
                                Remove
                            </Button>
                        </div>
                    </div>
                ))}
            </div>

            {/* Optional Demographics fields */}
            <div>
                <h3 className="text-lg font-semibold mb-2">Sociodemographic Info</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 border p-4 mb-2">
                    <FormField label="Citizenship (optional)">
                        <Select name="citizenship" value={form.citizenship || ""} onChange={onChange}>
                            <option value="">Select</option>
                            {citizenshipOptions.map((value) => (
                                <option key={value} value={value}>{value}</option>
                            ))}
                        </Select>
                    </FormField>

                    <FormField label="Religion (optional)">
                        <Select name="religion" value={form.religion || ""} onChange={onChange}>
                            <option value="">Select</option>
                            {religionOptions.map((value) => (
                                <option key={value} value={value}>{value}</option>
                            ))}
                        </Select>
                    </FormField>

                    <FormField label="Caste (optional)">
                        <Select name="caste" value={form.caste || ""} onChange={onChange}>
                            <option value="">Select</option>
                            {casteOptions.map((value) => (
                                <option key={value} value={value}>{value}</option>
                            ))}
                        </Select>
                    </FormField>

                    <FormField label="Occupation (optional)">
                        <Select name="occupation" value={form.occupation || ""} onChange={onChange}>
                            <option value="">Select</option>
                            {occupationOptions.map((value) => (
                                <option key={value} value={value}>{value}</option>
                            ))}
                        </Select>
                    </FormField>

                    <FormField label="Education (optional)">
                        <Select name="education" value={form.education || ""} onChange={onChange}>
                            <option value="">Select</option>
                            {educationOptions.map((value) => (
                                <option key={value} value={value}>{value}</option>
                            ))}
                        </Select>
                    </FormField>

                    <FormField label="Annual Income (optional)">
                        <Select name="annualIncome" value={form.annualIncome || ""} onChange={onChange}>
                            <option value="">Select</option>
                            {annualIncomeOptions.map((value) => (
                                <option key={value} value={value}>{value}</option>
                            ))}
                        </Select>
                    </FormField>
                </div>
            </div>


            {/* billingReferral */}
            <div>
                <h3 className="text-lg font-semibold mb-2">Billing Referral</h3>
                <div className="grid grid-cols-1 md:grid-cols-5 gap-4 border p-4 mb-2">
                    <FormField label="Billing Type">
                        <Select
                            name="billingType"
                            value={form.billingReferral?.billingType || ""}
                            onChange={onObjectChange("billingReferral")}
                        >
                            <option value="">Select</option>
                            {billingTypeOptions.map((type) => (
                                <option key={type} value={type}>{type}</option>
                            ))}
                        </Select>
                    </FormField>

                    <FormField label="Referred By">
                        <Input
                            name="referredBy"
                            value={form.billingReferral?.referredBy || ""}
                            onChange={onObjectChange("billingReferral")}
                        />
                    </FormField>
                </div>
            </div>



            {/* Referrals */}
            <div>
                <div className="flex justify-between items-center mb-2">
                    <h3 className="text-lg font-semibold">Referrals</h3>
                    <div className="col-span-1 text-right">
                        <Button
                            type="button"
                            className="btn btn-sm btn-outline"
                            onClick={() => addArrayItem(setForm, "referrals", {})}
                        >
                            + Add
                        </Button>
                    </div>
                </div>

                {form.referrals?.map((referral, index) => (
                    <div key={index} className="grid grid-cols-1 md:grid-cols-5 gap-4 border p-4 mb-2">
                        <FormField label="From Facility ID">
                            <Input name="fromFacilityId" value={referral.fromFacilityId || ""} onChange={onReferralChange(index)} />
                        </FormField>
                        <FormField label="To Facility ID">
                            <Input name="toFacilityId" value={referral.toFacilityId || ""} onChange={onReferralChange(index)} />
                        </FormField>
                        <FormField label="Referral Date">
                            <Calendar name="referralDate" value={referral.referralDate || ""} onChange={onReferralChange(index)} />
                        </FormField>
                        <FormField label="Reason">
                            <Input name="reason" value={referral.reason || ""} onChange={onReferralChange(index)} />
                        </FormField>

                        <div className="w-1/4 flex justify-end mt-4">
                            <Button
                                type="button"
                                className="btn btn-sm btn-outline text-red-600 border-red-500 hover:bg-red-50 w-auto"
                                onClick={() => removeArrayItem(setForm, "referrals", index)}
                            >
                                Remove
                            </Button>
                        </div>
                    </div>
                ))}
            </div>


            {/* Relationships */}
            {/* <div>
                <div className="flex justify-between items-center mb-2">
                    <h3 className="text-lg font-semibold">Relationships</h3>
                    <div className="col-span-1 text-right">
                        <Button
                            type="button"
                            className="btn btn-sm btn-outline"
                            onClick={() => addArrayItem(setForm, "relationships", {})}
                        >
                            + Add
                        </Button>
                    </div>
                </div>

                {form.relationships?.map((relationship, index) => (
                    <div key={index} className="grid grid-cols-1 md:grid-cols-5 gap-4 border p-4 mb-2">
                        <FormField label="Relative ID">
                            <Input name="relativeId" value={relationship.relativeId || ""} onChange={onRelationshipChange(index)} />
                        </FormField>
                        <FormField label="Relationship Type">
                            <Select name="relationshipType" value={relationship.relationshipType || ""} onChange={onRelationshipChange(index)}>
                                <option value="">Select</option>
                                {relationTypeOptions.map(r => (
                                    <option key={r} value={r}>{r}</option>
                                ))}
                            </Select>
                        </FormField>

                        <div className="w-1/4 flex justify-end mt-4">
                            <Button
                                type="button"
                                className="btn btn-sm btn-outline text-red-600 border-red-500 hover:bg-red-50 w-auto"
                                onClick={() => removeArrayItem(setForm, "relationships", index)}
                            >
                                Remove
                            </Button>
                        </div>
                    </div>
                ))}
            </div> */}

            {/* insurance */}
            <div>
                <h3 className="text-lg font-semibold mb-2">Insurance</h3>
                <div className="grid grid-cols-1 md:grid-cols-5 gap-4 border p-4 mb-2">
                    <FormField label="Insurance Provider">
                        <Input
                            name="insuranceProvider"
                            value={form.insurance?.insuranceProvider || ""}
                            onChange={onObjectChange("insurance")}
                        />
                    </FormField>

                    <FormField label="Policy Number">
                        <Input
                            name="policyNumber"
                            value={form.insurance?.policyNumber || ""}
                            onChange={onObjectChange("insurance")}
                        />
                    </FormField>

                    <FormField label="Policy Start Date">
                        <Calendar
                            name="policyStartDate"
                            value={form.insurance?.policyStartDate || ""}
                            onChange={onObjectChange("insurance")}
                        />
                    </FormField>

                    <FormField label="Policy End Date">
                        <Calendar
                            name="policyEndDate"
                            value={form.insurance?.policyEndDate || ""}
                            onChange={onObjectChange("insurance")}
                        />
                    </FormField>

                    <FormField label="Coverage Amount">
                        <Input
                            name="coverageAmount"
                            type="number"
                            value={form.insurance?.coverageAmount ?? ""}
                            onChange={onObjectChange("insurance")}
                        />
                    </FormField>
                </div>
            </div>



            {/* Tokens */}
            <div>
                <div className="flex justify-between items-center mb-2">
                    <h3 className="text-lg font-semibold">Tokens</h3>
                    <div className="col-span-1 text-right">
                        <Button
                            type="button"
                            className="btn btn-sm btn-outline"
                            onClick={() => addArrayItem(setForm, "tokens", {})}
                        >
                            + Add
                        </Button>
                    </div>
                </div>

                {form.tokens?.map((token, index) => (
                    <div key={index} className="grid grid-cols-1 md:grid-cols-5 gap-4 border p-4 mb-2">
                        <FormField label="Token Number">
                            <Input name="tokenNumber" value={token.tokenNumber || ""} onChange={onTokenChange(index)} />
                        </FormField>
                        <FormField label="Issue Date">
                            <Calendar name="issueDate" value={token.issueDate || ""} onChange={onTokenChange(index)} />
                        </FormField>
                        <FormField label="Expiry Date">
                            <Calendar name="expiryDate" value={token.expiryDate || ""} onChange={onTokenChange(index)} />
                        </FormField>
                        <FormField label="Allocated To">
                            <Input name="allocatedTo" value={token.allocatedTo || ""} onChange={onTokenChange(index)} />
                        </FormField>
                        <FormField label="Status">
                            <Select name="status" value={token.status || ""} onChange={onTokenChange(index)}>
                                <option value="">Select</option>
                                <option value="Active">Active</option>
                                <option value="Expired">Expired</option>
                                <option value="Pending">Pending</option>
                            </Select>
                        </FormField>
                        <FormField label="Is Registered">
                            <Select name="isRegistered" value={String(token.isRegistered)} onChange={onTokenChange(index)}>
                                <option value="true">Yes</option>
                                <option value="false">No</option>
                            </Select>
                        </FormField>

                        <div className="w-1/4 flex justify-end mt-4">
                            <Button
                                type="button"
                                className="btn btn-sm btn-outline text-red-600 border-red-500 hover:bg-red-50 w-auto"
                                onClick={() => removeArrayItem(setForm, "tokens", index)}
                            >
                                Remove
                            </Button>
                        </div>
                    </div>
                ))}
            </div>
            <div className="pt-4 w-1/8">
                <Button type="submit" variant="primary">Submit</Button>
            </div>
        </form>
    );
};
