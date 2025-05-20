export enum Title {
  Mr = "Mr",
  Mrs = "Mrs",
  Ms = "Ms",
  Dr = "Dr",
  Master = "Master",
  Miss = "Miss",
  Other = "Other",
}

export enum IdentifierType {
  ABHA = "ABHA",
  Aadhar = "Aadhar",
  Passport = "Passport",
  Driving_License = "Driving_License",
  PAN = "PAN",
}

export enum Gender {
  Male = "Male",
  Female = "Female",
  Other = "Other",
}

export enum BloodGroup {
  A_PLUS = "A+",
  A_MINUS = "A-",
  B_PLUS = "B+",
  B_MINUS = "B-",
  AB_PLUS = "AB+",
  AB_MINUS = "AB-",
  O_PLUS = "O+",
  O_MINUS = "O-",
}

export enum MaritalStatus {
  Single = "Single",
  Married = "Married",
  Divorced = "Divorced",
  Widowed = "Widowed",
}

export enum ContactMode {
  Phone = "Phone",
  Email = "Email",
  None = "None",
}

export enum PhonePref {
  Call = "Call",
  SMS = "SMS",
  WhatsApp = "WhatsApp",
}

export enum AddressType {
  Present = "Present",
  Permanent = "Permanent",
}

export enum BillingType {
  General = "General",
  Insurance = "Insurance",
  Corporate = "Corporate",
  Cash = "Cash",
}

export enum RelationType {
  Spouse = "Spouse",
  Parent = "Parent",
  Child = "Child",
  Sibling = "Sibling",
  Guardian = "Guardian",
  Friend = "Friend",
  Other = "Other",
}

export enum Citizenship {
  Indian = "Indian",
}

export enum Religion {
  Buddhist = "Buddhist",
  Christian = "Christian",
  Hindu = "Hindu",
  Muslim = "Muslim",
  Sikh = "Sikh",
  Others = "Others",
  Unknown = "Unknown",
}

export enum Caste {
  General = "General",
  OBC = "OBC",
  SC = "SC",
  ST = "ST",
  Unknown = "Unknown",
}

export enum Occupation {
  BankEmployee = "Bank employee",
  Business = "Business",
  Carpenter = "Carpenter",
  Coolie = "Coolie",
  Doctor = "Doctor",
  Driver = "Driver",
  Engineer = "Engineer",
  Farmer = "Farmer",
  GovtEmployee = "Govt employee",
  Mechanic = "Mechanic",
  NotApplicable = "Not applicable",
  Nurse = "Nurse",
  Other = "Other",
  Painter = "Painter",
  Pensioner = "Pensioner",
  Politician = "Politician",
  PrivateEmployee = "Private employee",
  Retired = "Retired",
  Student = "Student",
  Tailor = "Tailor",
  Unemployed = "Unemployed",
  Unknown = "Unknown",
}

export enum Education {
  Graduate = "Graduate",
  Illiterate = "Illiterate",
  NotApplicable = "Not applicable",
  Others = "Others",
  PostGraduate = "Post Graduate",
  PreUniversity = "Pre university",
  Primary = "Primary",
  Secondary = "Secondary",
  Unknown = "Unknown",
}

export enum AnnualIncome {
  Below1L = "₹1,00,000",
  L1To3 = "₹1,00,000 - ₹3,00,000",
  L3To5 = "₹3,00,001 - ₹5,00,000",
  L5To10 = "₹5,00,001 - ₹10,00,000",
  L10To15 = "₹10,00,001 - ₹15,00,000",
  L15To20 = "₹15,00,001 - ₹20,00,000",
  Above20 = "Above ₹20,00,000",
}


export const titleOptions = Object.values(Title);
export const identifierTypeOptions = Object.values(IdentifierType);
export const genderOptions = Object.values(Gender);
export const bloodGroupOptions = Object.values(BloodGroup);
export const maritalStatusOptions = Object.values(MaritalStatus);
export const contactModeOptions = Object.values(ContactMode);
export const phonePrefOptions = Object.values(PhonePref);
export const addressTypeOptions = Object.values(AddressType);
export const billingTypeOptions = Object.values(BillingType);
export const relationTypeOptions = Object.values(RelationType);
export const citizenshipOptions = Object.values(Citizenship);
export const religionOptions = Object.values(Religion);
export const casteOptions = Object.values(Caste);
export const occupationOptions = Object.values(Occupation);
export const educationOptions = Object.values(Education);
export const annualIncomeOptions = Object.values(AnnualIncome);

