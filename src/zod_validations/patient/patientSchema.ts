import { z } from "zod";
import { IdentifierType, RelationType } from "../../types/patientenums";

//
// ✅ Helper Functions
//
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
    .refine((val) => /^\d{10}$/.test(val), { message: " Phone Number is required and must be 10 digit Number" });

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

//
// ✅ Schema
//
export const patientSchema = z.object({
  title: requiredDropdown("Title is required"),

  firstName: requiredName("First name is required"),
  middleName: optionalName(),
  lastName: requiredName("Last name is required"),

  dateOfBirth: requiredDropdown("Date of birth is required"),
  gender: requiredDropdown("Gender is required"),

  identifierType: z.nativeEnum(IdentifierType, {
    errorMap: () => ({ message: "Identifier Type is required" }),
  }),

  identifierNumber: z.union([z.string(), z.literal(null)])
    .transform((val) => val ?? "")
    .refine((val) => val.length > 0, { message: "Identifier Number is required" }),

  contacts: z.array(
    z.object({
      phoneNumber: requiredPhone(),
      mobileNumber: optionalPhone(),
      email: optionalEmail(),
    })
  ).min(1, "At least one contact is required"),

  emergencyContacts: z.array(
    z.object({
      contactName: requiredName("Contact name is required"),
      relationship: z.nativeEnum(RelationType, {
        errorMap: () => ({ message: "Relationship is required" }),
      }),
      phoneNumber: requiredPhone(),
    })
  ).min(1, "At least one emergency contact is required"),

  addresses: z.array(
    z.object({
      pincode: optionalPincode(),
    })
  ).optional(),

  abha: z.object({
    abhaNumber: optionalString(),
    abhaAddress: optionalString(),
  }).optional(),

  informationSharing: z.object({
    shareWithSpouse: z.boolean().optional(),
    shareWithChildren: z.boolean().optional(),
    shareWithCaregiver: z.boolean().optional(),
    shareWithOther: z.boolean().optional(),
  }).optional(),
});