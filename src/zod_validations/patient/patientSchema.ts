import { z } from "zod";
import {
  IdentifierType,AddressType,
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
    .refine((val) => /^[A-Za-z\s]+$/.test(val), { message: "Only letters and spaces allowed" })
    .refine((val) => val.length > 0, { message: msg });

const optionalName = () =>
  z.union([z.string(), z.literal(null)])
    .transform((val) => val ?? "")
    .refine((val) => !val || /^[A-Za-z\s]+$/.test(val), {
      message: "Only letters and spaces allowed",
    });

const requiredPhone = () =>
  z.union([z.string(), z.literal(null)])
    .transform((val) => val ?? "")
    .refine((val) => /^\d{10}$/.test(val), {
      message: "Phone Number is required and must be 10 digit Number",
    });

const optionalPhone = () =>
  z.preprocess(
    (val) => (val === null || val === undefined ? "" : val),
    z.string().refine(
      (val) => val === "" || /^\d{10}$/.test(val),
      { message: "Mobile must be 10 digits" }
    )
  );


const optionalEmail = () =>
  z.preprocess(
    (val) => (val === null || val === undefined ? "" : val),
    z.string().refine(
      (val) => val === "" || /^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/.test(val),
      {
        message: "Invalid email format",
      }
    )
  );


const optionalPincode = () =>
  z.union([z.string(), z.literal(null)])
    .transform((val) => val ?? "")
    .refine((val) => !val || /^\d{6}$/.test(val), {
      message: "Pincode must be 6 digits",
    });


// --- Contact Schema ---

const contactSchema = z.object({
  mobileNumber: optionalPhone(),
  phoneNumber: optionalPhone(),
  email: optionalEmail(),
  preferredContactMode: z.nativeEnum(ContactMode).nullable().optional(),
  phoneContactPreference: z.nativeEnum(PhonePref).nullable().optional(),
  consentToShare: z.boolean().optional(),
});

const contactsSchema = z.array(contactSchema).superRefine((contacts, ctx) => {
  contacts.forEach((contact, index) => {
    const phone = (contact.phoneNumber ?? "").trim();

    if (index === 0) {
      if (!phone) {
        ctx.addIssue({
          path: [index, "phoneNumber"],
          code: z.ZodIssueCode.custom,
          message: "Primary contact phone number is required",
        });
      } else if (!/^\d{10}$/.test(phone)) {
        ctx.addIssue({
          path: [index, "phoneNumber"],
          code: z.ZodIssueCode.custom,
          message: "Phone number must be 10 digits",
        });
      }
    } else {
      if (phone && !/^\d{10}$/.test(phone)) {
        ctx.addIssue({
          path: [index, "phoneNumber"],
          code: z.ZodIssueCode.custom,
          message: "Phone number must be 10 digits",
        });
      }
    }
  });
});

const addressSchema = z.object({
  addressType: z.nativeEnum(AddressType).optional(),
  houseNoOrFlatNo: z.string().nullable().optional(),
  localityOrSector: z.string().nullable().optional(),
  cityOrVillage: z.string().nullable().optional(),
  pincode: z.string().nullable().optional()
    .refine((val) => {
      if (!val) return true; // allow empty/null
      return /^\d{6}$/.test(val); // must be 6 digits if present
    }, {
      message: "Pincode must be exactly 6 digits",
    }),
  districtId: z.string().nullable().optional(),
  stateId: z.string().nullable().optional(),
  country: z.string().nullable().optional(),
});

const emergencyContactSchema = z.object({
  contactName: z.string().nullable().optional(),
  // relationship: z.nativeEnum(RelationType).nullable().optional(),
  relationship: z.any().optional(),
  phoneNumber: z.string().nullable().optional(),
}).superRefine((data, ctx) => {
  const hasAnyValue =
    !!data.contactName?.trim() ||
    !!data.phoneNumber?.trim() ||
    data.relationship != null;

  if (hasAnyValue) {
    if (!data.contactName || !/^[A-Za-z\s]+$/.test(data.contactName)) {
      ctx.addIssue({
        path: ["contactName"],
        code: z.ZodIssueCode.custom,
        message: "Contact name must contain only letters",
      });
    }

    if (!data.phoneNumber || !/^\d{10}$/.test(data.phoneNumber)) {
      ctx.addIssue({
        path: ["phoneNumber"],
        code: z.ZodIssueCode.custom,
        message: "Phone number must be exactly 10 digits",
      });
    }
  }
});

const requiredString = (msg: string) =>
  z.preprocess(
    (val) => {
      // Accept string or anything else, convert null/undefined/empty to ""
      if (val === null || val === undefined) return "";
      if (typeof val === "string") return val.trim();
      // If not string, convert to empty string (or you can throw here if you want stricter)
      return "";
    },
    z.string().min(1, { message: msg })
  );



// --- Patient Schema ---

export const patientSchema = z.object({
  facilityId: requiredString("Facility is required"),

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
    .refine((val) => /^[a-zA-Z0-9-]{6,20}$/.test(val), {
      message: "Identifier must be 6–20 alphanumeric characters",
    }),

  contacts: contactsSchema,
  addresses: z.array(addressSchema).optional(),
  emergencyContacts: z.array(emergencyContactSchema).optional(),



});
