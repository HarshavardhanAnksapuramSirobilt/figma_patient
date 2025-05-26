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
import { patientSchema } from "../../zod_validations/patient/patientSchema";
import { ZodError } from "zod";
import FormMessage from "../../commonfields/FormMessage";
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
import { createPatient, getPatientById, updatePatient } from "../../services/patientApis";
import { showSuccess } from "../../utils/toastUtils";
import { useNavigate } from "react-router-dom";
import { usePatientFormStore } from "../../store/patientFormStore";


type Props = {
    patientId?: string;
};

export const PatientRegistrationForm: React.FC<Props> = ({ patientId }) => {
    const [form, setForm] = useState<PatientRegistrationPayload>(
        defaultPatientRegistrationPayload
    );
    const [loading, setLoading] = useState(false);
    const { quickFormData, clearQuickFormData } = usePatientFormStore();


    const onChange = handleChange(setForm);
    const onContactChange = (index: number) => handleArrayChange(setForm, "contacts", index);
    const onAddressChange = (index: number) => handleArrayChange(setForm, "addresses", index);
    const onEmergencyChange = (index: number) => handleArrayChange(setForm, "emergencyContacts", index);
    const onReferralChange = (index: number) => handleArrayChange(setForm, "referrals", index);
    const onRelationshipChange = (index: number) => handleArrayChange(setForm, "relationships", index);
    const onTokenChange = (index: number) => handleArrayChange(setForm, "tokens", index);
    const onObjectChange = (key: keyof PatientRegistrationPayload) => handleObjectChange(setForm, key);
    const navigate = useNavigate();
    const [formErrors, setFormErrors] = useState<Record<string, string>>({});    // const handleSubmit = (e: React.FormEvent) => {

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        try {
            patientSchema.parse(form); // Zod validation
            setFormErrors({}); // Clear previous errors
            const fullName = `${form.firstName} ${form.middleName || ""} ${form.lastName}`.trim();

            if (patientId) {
                const { success, error } = await updatePatient(patientId, form);
                if (success) {
                    showSuccess("Patient updated successfully", fullName);
                    navigate("/list")
                } else {
                    console.log(error)
                }
            } else {
                const { success, error } = await createPatient(form);
                if (success) {
                    showSuccess("Patient Created Successfully", fullName);
                    navigate("/list")
                } else {
                    console.log(error)
                }
            }
        } catch (error: any) {
            if (error instanceof ZodError) {
                const fieldErrors: Record<string, string> = {};
                error.errors.forEach((e) => {
                    const path = e.path.join(".");
                    fieldErrors[path] = e.message;
                });
                setFormErrors(fieldErrors);
            } else {
                console.error("Unexpected error:", error);
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

    const isEditMode = Boolean(patientId);
    const handleInformationSharingChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, checked } = e.target;
        setForm(prevForm => ({
            ...prevForm,
            informationSharing: {
                ...prevForm.informationSharing,
                [name]: checked
            }
        }));
    };

    useEffect(() => {
        if (!patientId && quickFormData && quickFormData.firstName) {
            setForm(quickFormData);
            clearQuickFormData(); // Optional: clear after loading
        }
    }, []);


    return (

        <form onSubmit={handleSubmit} className="space-y-10 px-6 py-2 bg-white shadow-xl rounded-xl">

            <div className="text-center mb-1">
                <h2 className="text-lg font-semibold">{isEditMode ? "Edit Patient" : "Patient Registration"}</h2>
            </div>

            <div className="mb-3  -gray-200 rounded-md shadow-sm p-3 bg-gray-50">
                <h3 className="text-base font-medium mb-3">Basic Info</h3>
                <div className="grid grid-cols-1 md:grid-cols-5 gap-3">
                    <FormField label="Title" required>
                        <Select className="text-sm py-1 px-2" name="title" value={form.title || ""} onChange={onChange}>
                            <option value="">Select</option>
                            {titleOptions.map(t => <option key={t} value={t}>{t}</option>)}
                        </Select>
                        <FormMessage>{formErrors["title"]}</FormMessage>
                    </FormField>

                    <FormField label="First Name" required>
                        <Input className="text-sm py-1 px-2" name="firstName" value={form.firstName || ""} onChange={onChange} />
                        <FormMessage>{formErrors["firstName"]}</FormMessage>
                    </FormField>

                    <FormField label="Middle Name">
                        <Input className="text-sm py-1 px-2" name="middleName" value={form.middleName || ""} onChange={onChange} />
                        <FormMessage>{formErrors["middleName"]}</FormMessage>
                    </FormField>

                    <FormField label="Last Name" required>
                        <Input className="text-sm py-1 px-2" name="lastName" value={form.lastName || ""} onChange={onChange} />
                        <FormMessage>{formErrors["lastName"]}</FormMessage>
                    </FormField>

                    <FormField label="Date of Birth" required>
                        <Calendar className="text-sm py-1 px-2" name="dateOfBirth" value={form.dateOfBirth || ""} onChange={onChange} />
                        <FormMessage>{formErrors["dateOfBirth"]}</FormMessage>
                    </FormField>

                    <FormField label="Age">
                        <Input className="text-sm py-1 px-2" name="age" value={form.age ?? ""} readOnly />

                    </FormField>

                    <FormField label="Gender" required>
                        <Select className="text-sm py-1 px-2" name="gender" value={form.gender || ""} onChange={onChange}>
                            <option value="">Select</option>
                            {genderOptions.map(g => <option key={g} value={g}>{g}</option>)}
                        </Select>
                        <FormMessage>{formErrors["gender"]}</FormMessage>
                    </FormField>

                    <FormField label="Blood Group">
                        <Select className="text-sm py-1 px-2" name="bloodGroup" value={form.bloodGroup || ""} onChange={onChange}>
                            <option value="">Select</option>
                            {bloodGroupOptions.map(bg => <option key={bg} value={bg}>{bg}</option>)}
                        </Select>
                    </FormField>

                    <FormField label="Marital Status">
                        <Select className="text-sm py-1 px-2" name="maritalStatus" value={form.maritalStatus || ""} onChange={onChange}>
                            <option value="">Select</option>
                            {maritalStatusOptions.map(ms => <option key={ms} value={ms}>{ms}</option>)}
                        </Select>
                    </FormField>

                    <FormField label="Identifier Type" required>
                        <Select className="text-sm py-1 px-2" name="identifierType" value={form.identifierType || ""} onChange={onChange}>
                            <option value="">Select</option>
                            {identifierTypeOptions.map((type) => (
                                <option key={type} value={type}>{type}</option>
                            ))}

                        </Select>
                        <FormMessage>{formErrors["identifierType"]}</FormMessage>
                    </FormField>

                    <FormField label="Identifier Number" required>
                        <Input className="text-sm py-1 px-2" name="identifierNumber" value={form.identifierNumber || ""} onChange={onChange} />
                        <FormMessage>{formErrors["identifierNumber"]}</FormMessage>
                    </FormField>
                </div>
            </div>


            {/* contacts */}
                <div className="mb-3  -gray-200 rounded-md shadow-sm p-3 bg-gray-50">
                    <div className="flex justify-between items-center mb-2">
                        <h3 className="text-base font-medium">Contacts</h3>
                        <button
                            type="button"
                            className="text-xs text-indigo-600 font-medium  -indigo-300 px-2 py-1 rounded hover:bg-indigo-50 transition"
                            onClick={() => addArrayItem(setForm, "contacts", {})}
                        >
                            + Add
                        </button>
                    </div>
                    {form.contacts?.map((contact, index) => (
                        <div key={index} className="grid grid-cols-1 md:grid-cols-5 gap-3 p-3 mb-2 bg-white  rounded-md">
                            <FormField label="Primary Phone Number" required={index === 0}>
                                <Input className="text-sm py-1 px-2" name="phoneNumber" value={contact.phoneNumber || ""} onChange={onContactChange(index)} />
                                {/* <FormMessage>{formErrors?.[`contacts.${index}.phoneNumber`]}</FormMessage> */}
                                {index === 0 && (<FormMessage>{formErrors["contacts.0.phoneNumber"]}</FormMessage>)}
                            </FormField>
                            <FormField label="Alternate Number">
                                <Input className="text-sm py-1 px-2" name="mobileNumber" value={contact.mobileNumber || ""} onChange={onContactChange(index)} />
                                <FormMessage>{formErrors?.[`contacts.${index}.mobileNumber`]}</FormMessage>
                            </FormField>
                            <FormField label="Email">
                                <Input className="text-sm py-1 px-2" name="email" value={contact.email || ""} onChange={onContactChange(index)} />
                            </FormField>
                            <FormField label="Preferred Contact Mode">
                                <Select className="text-sm py-1 px-2" name="preferredContactMode" value={contact.preferredContactMode || ""} onChange={onContactChange(index)}>
                                    <option value="">Select</option>
                                    {contactModeOptions.map(mode => (
                                        <option key={mode} value={mode}>{mode}</option>
                                    ))}
                                </Select>
                            </FormField>
                            <FormField label="Phone Contact Preference">
                                <Select className="text-sm py-1 px-2" name="phoneContactPreference" value={contact.phoneContactPreference || ""} onChange={onContactChange(index)}>
                                    <option value="">Select</option>
                                    {phonePrefOptions.map(p => (
                                        <option key={p} value={p}>{p}</option>
                                    ))}
                                </Select>
                            </FormField>
                            <FormField label="Consent to Share">
                                <Select className="text-sm py-1 px-2" name="consentToShare" value={String(contact.consentToShare)} onChange={onContactChange(index)}>
                                    <option value="true">Yes</option>
                                    <option value="false">No</option>
                                </Select>
                            </FormField>
                            <div className="w-full flex justify-end mt-1 md:col-span-5">
                                <button
                                    type="button"
                                    className="text-xs text-red-600 font-medium  -red-300 px-3 py-1 rounded hover:bg-red-50 transition"
                                    onClick={() => removeArrayItem(setForm, "contacts", index)}
                                >
                                    Remove
                                </button>
                            </div>
                        </div>
                    ))}
                </div>



            {/* Repeat similar pattern for addresses, emergencyContacts, referrals, relationships, tokens */}
            {/* Addresses */}
<div className="mb-6 rounded-lg shadow-md p-5 bg-gray-50">
  <div className="flex justify-between items-center mb-4 bg-purple-100 p-3 rounded-md">
    <h3 className="text-lg font-semibold text-purple-800">Address</h3>
    <button
      type="button"
      className="text-sm text-purple-700 font-semibold px-3 py-1 rounded-md hover:bg-purple-200 transition"
      onClick={() => addArrayItem(setForm, "addresses", {})}
    >
      + Add
    </button>
  </div>


  {form.addresses?.map((address, index) => (
    <div
      key={index}
      className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4 p-4 mb-5 bg-white rounded-lg shadow-sm border border-gray-200"
    >
      <FormField label="Address Type">
        <Select
          className="text-sm py-2 px-3 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
          name="addressType"
          value={address.addressType || ""}
          onChange={onAddressChange(index)}
        >
          <option value="">Select</option>
          {addressTypeOptions.map((type) => (
            <option key={type} value={type}>
              {type}
            </option>
          ))}
        </Select>
      </FormField>

      <FormField label="House/Flat No">
        <Input
          className="text-sm py-2 px-3 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
          name="houseNoOrFlatNo"
          value={address.houseNoOrFlatNo || ""}
          onChange={onAddressChange(index)}
        />
      </FormField>

      <FormField label="Locality/Sector">
        <Input
          className="text-sm py-2 px-3 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
          name="localityOrSector"
          value={address.localityOrSector || ""}
          onChange={onAddressChange(index)}
        />
      </FormField>

      <FormField label="City/Village">
        <Input
          className="text-sm py-2 px-3 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
          name="cityOrVillage"
          value={address.cityOrVillage || ""}
          onChange={onAddressChange(index)}
        />
      </FormField>

      <FormField label="Pincode">
        <Input
          className="text-sm py-2 px-3 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
          name="pincode"
          value={address.pincode || ""}
          onChange={onAddressChange(index)}
        />
      </FormField>

      <FormField label="District">
        <Input
          className="text-sm py-2 px-3 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
          name="districtId"
          value={address.districtId || ""}
          onChange={onAddressChange(index)}
        />
      </FormField>

      <FormField label="State">
        <Input
          className="text-sm py-2 px-3 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
          name="stateId"
          value={address.stateId || ""}
          onChange={onAddressChange(index)}
        />
      </FormField>

      <FormField label="Country">
        <Input
          className="text-sm py-2 px-3 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
          name="country"
          value={address.country || ""}
          onChange={onAddressChange(index)}
        />
      </FormField>

      {/* Remove button spans full row on smaller screens */}
      <div className="md:col-span-3 lg:col-span-4 flex justify-end items-center mt-1">
        <button
          type="button"
          className="text-xs text-red-600 font-semibold px-3 py-1 rounded-md hover:bg-red-100 transition"
          onClick={() => removeArrayItem(setForm, "addresses", index)}
          aria-label={`Remove address ${index + 1}`}
        >
          Remove
        </button>
      </div>
    </div>
  ))}
</div>

            {/* Emergency Contacts */}
                <div className="mb-3 border border-gray-200 rounded-md shadow-sm p-3 bg-gray-50">
                    <div className="flex justify-between items-center mb-2">
                        <h3 className="text-base font-medium">Emergency Contacts</h3>
                        <button
                            type="button"
                            className="text-xs text-indigo-600 font-medium border border-indigo-300 px-2 py-1 rounded hover:bg-indigo-50 transition"
                            onClick={() => addArrayItem(setForm, "emergencyContacts", {})}
                        >
                            + Add
                        </button>
                    </div>
                    {form.emergencyContacts?.map((contact, index) => (
                        <div key={index} className="grid grid-cols-1 md:grid-cols-5 gap-3 p-3 mb-2 bg-white  rounded-md">
                            <FormField label="Contact Name">
                                <Input className="text-sm py-1 px-2" name="contactName" value={contact.contactName || ""} onChange={onEmergencyChange(index)} />
                            </FormField>
                            <FormField label="Relationship">
                                <Select className="text-sm py-1 px-2" name="relationship" value={contact.relationship || ""} onChange={onEmergencyChange(index)}>
                                    <option value="">Select</option>
                                    {relationTypeOptions.map(rel => (
                                        <option key={rel} value={rel}>{rel}</option>
                                    ))}
                                </Select>
                            </FormField>
                            <FormField label="Phone Number">
                                <Input className="text-sm py-1 px-2" name="phoneNumber" value={contact.phoneNumber || ""} onChange={onEmergencyChange(index)} />
                            </FormField>
                            <div className="w-full flex justify-end mt-1 md:col-span-5">
                                <button
                                    type="button"
                                    className="text-xs text-red-600 font-medium border border-red-300 px-3 py-1 rounded hover:bg-red-50 transition"
                                    onClick={() => removeArrayItem(setForm, "emergencyContacts", index)}
                                >
                                    Remove
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            <div className="mb-3 border border-gray-200 rounded-md shadow-sm p-3 bg-gray-50">
                <h3 className="text-base font-medium mb-4">Information Sharing Consent</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    {[
                        { label: "Share With Spouse", name: "shareWithSpouse" },
                        { label: "Share With Children", name: "shareWithChildren" },
                        { label: "Share With Caregiver", name: "shareWithCaregiver" },
                        { label: "Share With Other", name: "shareWithOther" }
                    ].map(({ label, name }) => (
                        <label key={name} className="flex items-center space-x-2 p-2 bg-white rounded border border-gray-200 shadow-sm hover:shadow-md transition">
                            <input
                                type="checkbox"
                                name={name}
                                checked={form.informationSharing?.[name] || false}
                                onChange={handleInformationSharingChange}
                                className="form-checkbox h-5 w-5 text-indigo-600"
                            />
                            <span className="text-sm text-gray-700 font-medium">{label}</span>
                        </label>
                    ))}
                </div>
            </div>



            {/* Optional Demographics fields */}
            <div className="mb-3 border border-gray-200 rounded-md shadow-sm p-3 bg-gray-50">
                <h3 className="text-base font-medium mb-2">Additional Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    <FormField label="Citizenship (optional)">
                        <Select className="text-sm py-1 px-2" name="citizenship" value={form.citizenship || ""} onChange={onChange}>
                            <option value="">Select</option>
                            {citizenshipOptions.map((value) => (
                                <option key={value} value={value}>{value}</option>
                            ))}
                        </Select>
                    </FormField>

                    <FormField label="Religion (optional)">
                        <Select className="text-sm py-1 px-2" name="religion" value={form.religion || ""} onChange={onChange}>
                            <option value="">Select</option>
                            {religionOptions.map((value) => (
                                <option key={value} value={value}>{value}</option>
                            ))}
                        </Select>
                    </FormField>

                    <FormField label="Caste (optional)">
                        <Select className="text-sm py-1 px-2" name="caste" value={form.caste || ""} onChange={onChange}>
                            <option value="">Select</option>
                            {casteOptions.map((value) => (
                                <option key={value} value={value}>{value}</option>
                            ))}
                        </Select>
                    </FormField>

                    <FormField label="Occupation (optional)">
                        <Select className="text-sm py-1 px-2" name="occupation" value={form.occupation || ""} onChange={onChange}>
                            <option value="">Select</option>
                            {occupationOptions.map((value) => (
                                <option key={value} value={value}>{value}</option>
                            ))}
                        </Select>
                    </FormField>

                    <FormField label="Education (optional)">
                        <Select className="text-sm py-1 px-2" name="education" value={form.education || ""} onChange={onChange}>
                            <option value="">Select</option>
                            {educationOptions.map((value) => (
                                <option key={value} value={value}>{value}</option>
                            ))}
                        </Select>
                    </FormField>

                    <FormField label="Annual Income (optional)">
                        <Select className="text-sm py-1 px-2" name="annualIncome" value={form.annualIncome || ""} onChange={onChange}>
                            <option value="">Select</option>
                            {annualIncomeOptions.map((value) => (
                                <option key={value} value={value}>{value}</option>
                            ))}
                        </Select>
                    </FormField>
                </div>
            </div>



            {/* billingReferral */}
            <div className="mb-3 border border-gray-200 rounded-md shadow-sm p-3 bg-gray-50">
                <h3 className="text-base font-medium mb-2">Billing Referral</h3>
                <div className="grid grid-cols-1 md:grid-cols-5 gap-3">
                    <FormField label="Billing Type">
                        <Select
                            className="text-sm py-1 px-2"
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
                            className="text-sm py-1 px-2"
                            name="referredBy"
                            value={form.billingReferral?.referredBy || ""}
                            onChange={onObjectChange("billingReferral")}
                        />
                    </FormField>
                </div>
            </div>




            {/* Referrals */}
            <div className="mb-3 rounded-md shadow-sm p-3">
                <div className="flex justify-between items-center ">
                    <h3 className="text-base font-medium">Referrals</h3>
                    <button
                        type="button"
                        className="text-xs text-indigo-600 font-medium  border-indigo-300 px-2 py-1 rounded hover:bg-indigo-50 transition"
                        onClick={() => addArrayItem(setForm, "referrals", {})}
                    >
                        + Add
                    </button>
                </div>
                {form.referrals?.map((referral, index) => (
                    <div key={index} className="grid grid-cols-1 md:grid-cols-5 gap-3 p-3 mb-2 bg-white rounded-md">
                        <FormField label="From Facility ID">
                            <Input className="text-sm py-1 px-2" name="fromFacilityId" value={referral.fromFacilityId || ""} onChange={onReferralChange(index)} />
                        </FormField>
                        <FormField label="To Facility ID">
                            <Input className="text-sm py-1 px-2" name="toFacilityId" value={referral.toFacilityId || ""} onChange={onReferralChange(index)} />
                        </FormField>
                        <FormField label="Referral Date">
                            <Calendar className="text-sm py-1 px-2" name="referralDate" value={referral.referralDate || ""} onChange={onReferralChange(index)} />
                        </FormField>
                        <FormField label="Reason">
                            <Input className="text-sm py-1 px-2" name="reason" value={referral.reason || ""} onChange={onReferralChange(index)} />
                        </FormField>
                        <div className="w-full flex justify-end mt-1 md:col-span-5">
                            <button
                                type="button"
                                className="text-xs text-red-600 font-medium border border-red-300 px-3 py-1 rounded hover:bg-red-50 transition"
                                onClick={() => removeArrayItem(setForm, "referrals", index)}
                            >
                                Remove
                            </button>
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
                    <div key={index} className="grid grid-cols-1 md:grid-cols-5 gap-4  p-4 mb-2">
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
                                className="btn btn-sm btn-outline text-red-600 -red-500 hover:bg-red-50 w-auto"
                                onClick={() => removeArrayItem(setForm, "relationships", index)}
                            >
                                Remove
                            </Button>
                        </div>
                    </div>
                ))}
            </div> */}

            {/* insurance */}
            <div className="mb-3 border border-gray-200 rounded-md shadow-sm p-3 bg-gray-50">
                <h3 className="text-base font-medium mb-2">Insurance</h3>
                <div className="grid grid-cols-1 md:grid-cols-5 gap-3">
                    <FormField label="Insurance Provider">
                        <Input
                            className="text-sm py-1 px-2"
                            name="insuranceProvider"
                            value={form.insurance?.insuranceProvider || ""}
                            onChange={onObjectChange("insurance")}
                        />
                    </FormField>
                    <FormField label="Policy Number">
                        <Input
                            className="text-sm py-1 px-2"
                            name="policyNumber"
                            value={form.insurance?.policyNumber || ""}
                            onChange={onObjectChange("insurance")}
                        />
                    </FormField>
                    <FormField label="Policy Start Date">
                        <Calendar
                            className="text-sm py-1 px-2"
                            name="policyStartDate"
                            value={form.insurance?.policyStartDate || ""}
                            onChange={onObjectChange("insurance")}
                        />
                    </FormField>
                    <FormField label="Policy End Date">
                        <Calendar
                            className="text-sm py-1 px-2"
                            name="policyEndDate"
                            value={form.insurance?.policyEndDate || ""}
                            onChange={onObjectChange("insurance")}
                        />
                    </FormField>
                    <FormField label="Coverage Amount">
                        <Input
                            className="text-sm py-1 px-2"
                            name="coverageAmount"
                            type="number"
                            value={form.insurance?.coverageAmount ?? ""}
                            onChange={onObjectChange("insurance")}
                        />
                    </FormField>
                </div>
            </div>




            {/* Tokens */}
            {/* <div>
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
                    <div key={index} className="grid grid-cols-1 md:grid-cols-5 gap-4  p-4 mb-2">
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
                                className="btn btn-sm btn-outline text-red-600 -red-500 hover:bg-red-50 w-auto"
                                onClick={() => removeArrayItem(setForm, "tokens", index)}
                            >
                                Remove
                            </Button>
                        </div>
                    </div>
                ))}
            </div> */}
            <div className="flex justify-center w-full max-w-5xl mx-auto gap-4 px-6">
                <button
                    type="submit"
                    className="basis-1/2 bg-indigo-600 text-white py-2 rounded-md font-medium hover:bg-indigo-700"
                >
                    {isEditMode ? "Update Patient" : "Create Patient"}
                </button>

                <button
                    type="button"
                    className="basis-1/2  bg-gray-300 text-gray-700 py-2 rounded-md font-medium hover:bg-gray-50"
                    onClick={(e) => {
                        e.preventDefault();
                        navigate("/list");
                    }}
                >
                    Cancel
                </button>
            </div>


        </form>
    );
};
