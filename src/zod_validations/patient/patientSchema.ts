import { z } from "zod";
import {
  IdentifierType,
  ContactMode,
  PhonePref,
  RelationType
} from "../../types/patientenums";

// --- Reusable Validators ---

const requiredEnum = <T extends Record<string, string>>(enumObj: T, msg: string) =>
  z.union([z.nativeEnum(enumObj), z.literal(null)])
    .refine((val) => val !== null, { message: msg });

const requiredDropdown = (msg: string) =>
  z.union([z.string(), z.literal(null)])
    .transform((val) => val ?? "")
    .refine((val) => val.length > 0, { message: msg });

const requiredName = (msg: string) =>
  z.union([z.string(), z.literal(null)])
    .transform((val) => val ?? "")
    .refine((val) => /^[A-Za-z]+$/.test(val), { message: "Only letters allowed" })
    .refine((val) => val.length > 0, { message: msg });

const optionalName = () =>
  z.union([z.string(), z.literal(null)])
    .transform((val) => val ?? "")
    .refine((val) => !val || /^[A-Za-z]+$/.test(val), {
      message: "Only letters allowed",
    });

const requiredPhone = () =>
  z.union([z.string(), z.literal(null)])
    .transform((val) => val ?? "")
    .refine((val) => /^\d{10}$/.test(val), {
      message: "Phone Number is required and must be 10 digit Number",
    });

const optionalPhone = () =>
  z.union([z.string(), z.literal(null)])
    .transform((val) => val ?? "")
    .refine((val) => !val || /^\d{10}$/.test(val), {
      message: "Mobile must be 10 digits",
    });

const optionalEmail = () =>
  z.string()
    .nullable()
    .transform((val) => val ?? "")
    .refine((val) => !val || /^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/.test(val), {
      message: "Invalid email format",
    });

const optionalPincode = () =>
  z.union([z.string(), z.literal(null)])
    .transform((val) => val ?? "")
    .refine((val) => !val || /^\d{6}$/.test(val), {
      message: "Pincode must be 6 digits",
    });

const optionalString = () =>
  z.union([z.string(), z.literal(null)]).transform((val) => val ?? "");

// --- Contact Schema ---

const contactSchema = z.object({
  mobileNumber: optionalPhone(),
  phoneNumber: optionalPhone(),
  email: optionalEmail(),
  preferredContactMode: z.nativeEnum(ContactMode).nullable().optional(),
  phoneContactPreference: z.nativeEnum(PhonePref).nullable().optional(),
  consentToShare: z.boolean().optional(),
});

// --- Patient Schema ---

export const patientSchema = z.object({
  title: requiredDropdown("Title is required"),

  firstName: requiredName("First name is required"),
  middleName: optionalName(),
  lastName: requiredName("Last name is required"),

  dateOfBirth: requiredDropdown("Date of birth is required"),
  gender: requiredDropdown("Gender is required"),

  identifierType: requiredEnum(IdentifierType, "Identifier type is required"),

  identifierNumber: z.union([z.string(), z.literal(null)])
    .transform((val) => val ?? "")
    .refine((val) => val.length > 0, { message: "Identifier number is required" })
    .refine((val) => /^[a-zA-Z0-9]{6,20}$/.test(val), {
      message: "Identifier must be 6–20 alphanumeric characters",
    }),

  contacts: z.array(contactSchema)
    .refine((arr) => !arr.length || !!arr[0].phoneNumber?.trim(), {
      message: "Primary contact phone number is required",
      path: ["0", "phoneNumber"],
    }),
});
