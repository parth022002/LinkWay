import { z } from "zod";
import { destinationUrlSchema } from "./url";
import { validateCustomCode } from "./short-code";

export const signupSchema = z.object({
  email: z.string().trim().email("Please provide a valid email address."),
  password: z.string().min(8, "Password must be at least 8 characters long."),
  name: z.string().trim().min(2, "Name must be at least 2 characters.").max(100),
});

export const loginSchema = z.object({
  email: z.string().trim().email("Please provide a valid email address."),
  password: z.string().min(1, "Password is required."),
});

export const createLinkSchema = z.object({
  destinationUrl: destinationUrlSchema,
  title: z.string().trim().max(120, "Title cannot exceed 120 characters.").optional(),
  campaignId: z.string().optional().nullable(),
  customCode: z
    .string()
    .trim()
    .optional()
    .refine((val) => {
      if (!val) return true;
      const res = validateCustomCode(val);
      return res.valid;
    }, {
      message: "Custom code does not meet validation criteria (3-32 alphanumeric chars, non-reserved).",
    }),
  expiresAt: z.string().datetime().optional().nullable(),
});

export const updateLinkSchema = z.object({
  destinationUrl: destinationUrlSchema.optional(),
  title: z.string().trim().max(120).optional(),
  status: z.enum(["ACTIVE", "PAUSED", "ARCHIVED", "DELETED"]).optional(),
  changeReason: z.string().trim().max(200).optional(),
  campaignId: z.string().optional().nullable(),
});

export const createCampaignSchema = z.object({
  name: z.string().trim().min(1, "Campaign name is required.").max(100),
  description: z.string().trim().max(500).optional(),
  channel: z.string().trim().max(50).optional(),
  utmSource: z.string().trim().max(100).optional(),
  utmMedium: z.string().trim().max(100).optional(),
});

export const abuseReportSchema = z.object({
  shortCode: z.string().trim().min(1, "Short code is required."),
  category: z.enum(["Phishing", "Malware", "Spam", "Scam", "Illegal Content", "Other"]),
  description: z.string().trim().min(10, "Please provide at least 10 characters describing the issue.").max(1000),
  reporterEmail: z.string().trim().email().optional().or(z.literal("")),
});

export const customDomainSchema = z.object({
  hostname: z
    .string()
    .trim()
    .toLowerCase()
    .regex(/^([a-z0-9]+(-[a-z0-9]+)*\.)+[a-z]{2,}$/, "Please provide a valid domain hostname (e.g., links.mybrand.com)"),
});
