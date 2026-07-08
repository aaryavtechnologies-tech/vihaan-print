import { z } from "zod";
import { SchoolType, SchoolStatus } from "@/types/school";

export const schoolSchema = z.object({
  schoolCode: z.string().min(2, "School Code must be at least 2 characters").max(20, "School Code must be less than 20 characters"),
  schoolName: z.string().min(3, "School Name must be at least 3 characters").max(100),
  schoolType: z.nativeEnum(SchoolType).default(SchoolType.SECONDARY),
  
  // Contact
  email: z.string().email("Invalid email address"),
  phone: z.string().min(10, "Phone number must be at least 10 digits").max(20),
  alternatePhone: z.string().optional().nullable(),
  website: z.string().url("Invalid URL format").optional().nullable().or(z.literal("")),
  
  // Address
  addressLine1: z.string().min(5, "Address Line 1 is required"),
  addressLine2: z.string().optional().nullable(),
  city: z.string().min(2, "City is required"),
  state: z.string().min(2, "State is required"),
  country: z.string().default("India"),
  postalCode: z.string().min(4, "Postal code is required"),
  
  // Academic Info
  establishedYear: z.coerce.number().int().min(1800).max(new Date().getFullYear()).optional().nullable(),
  board: z.string().optional().nullable(),
  medium: z.string().optional().nullable(),
  description: z.string().max(500, "Description cannot exceed 500 characters").optional().nullable(),
  
  // Branding (URLs from Cloudinary)
  logo: z.string().url().optional().nullable(),
  coverImage: z.string().url().optional().nullable(),
  principalName: z.string().optional().nullable(),
  principalSignature: z.string().url().optional().nullable(),
  
  // Metadata
  status: z.nativeEnum(SchoolStatus).default(SchoolStatus.ACTIVE),
});

export type SchoolFormValues = z.infer<typeof schoolSchema>;
