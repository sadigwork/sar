import { z } from 'zod';

// =========================
// Personal
// =========================

export const personalSchema = z.object({
  fullName: z.string().min(3),
  fullNameEn: z.string().min(3),
  nationalId: z.string().min(5),

  phoneNumber: z.string().optional(),

  birthDate: z
    .string()
    .optional()
    .refine((val) => !val || !isNaN(Date.parse(val)), {
      message: 'Invalid date',
    }),

  gender: z.string().optional(),
  address: z.string().optional(),
  city: z.string().optional(),
  country: z.string().optional(),

  specialization: z.string().min(2),

  graduationYear: z
    .string()
    .min(4)
    .transform((val) => parseInt(val, 10))
    .refine((val) => !isNaN(val), {
      message: 'Invalid graduation year',
    }),

  university: z.string().min(2),
});

// =========================
// Education
// =========================
export const educationSchema = z.array(
  z.object({
    degree: z.string().min(2),
    field: z.string().min(2),
    institution: z.string().min(2),
    country: z.string().min(2),

    startYear: z
      .string()
      .optional()
      .transform((v) => (v ? parseInt(v, 10) : undefined)),

    endYear: z
      .string()
      .optional()
      .transform((v) => (v ? parseInt(v, 10) : undefined)),

    inProgress: z.boolean().default(false),
  }),
);

// =========================
// Experience
// =========================
export const experienceSchema = z.array(
  z.object({
    company: z.string().min(2),
    position: z.string().min(2),

    startDate: z.string().refine((v) => !isNaN(Date.parse(v)), {
      message: 'Invalid start date',
    }),

    endDate: z
      .string()
      .optional()
      .refine((v) => !v || !isNaN(Date.parse(v)), {
        message: 'Invalid end date',
      }),

    isCurrent: z.boolean().default(false),

    years: z
      .string()
      .transform((v) => parseInt(v, 10))
      .refine((v) => !isNaN(v)),

    months: z
      .string()
      .transform((v) => parseInt(v, 10))
      .refine((v) => !isNaN(v)),
  }),
);

// =========================
// Documents
// =========================
export const documentSchema = z.object({
  type: z.string(), // ideally enum
  fileUrl: z.string().url(),

  // optional (لأنها تربط حسب السياق)
  profileId: z.string().optional(),
  applicationId: z.string().optional(),
});

export const documentsSchema = z.array(documentSchema);

// =========================
// Certifications
// =========================
export const certificationSchema = z.object({
  nameEn: z.string().min(2),
  nameAr: z.string().min(2),
  descriptionEn: z.string().optional(),
  descriptionAr: z.string().optional(),
});

export const certificationsSchema = z.array(certificationSchema);

// =========================
// Step Map
// =========================

export const stepSchemas = {
  personal: personalSchema,
  education: educationSchema,
  experience: experienceSchema,
  documents: documentsSchema,
  certifications: certificationsSchema,
};
