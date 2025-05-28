import { z } from 'zod';
import { validateEmail, validatePasswordStrength } from './security-utils';

/**
 * Validation schema for user registration
 */
export const registerSchema = z.object({
  username: z
    .string()
    .min(3, { message: 'Username must be at least 3 characters long' })
    .max(30, { message: 'Username cannot exceed 30 characters' })
    .regex(/^[a-zA-Z0-9_]+$/, {
      message: 'Username can only contain letters, numbers, and underscores',
    }),
  email: z
    .string()
    .email({ message: 'Please enter a valid email address' })
    .refine((email) => validateEmail(email), {
      message: 'Please enter a valid email address',
    }),
  password: z
    .string()
    .min(8, { message: 'Password must be at least 8 characters long' })
    .refine(
      (password) => validatePasswordStrength(password).valid,
      {
        message:
          'Password must include at least one uppercase letter, one lowercase letter, one number, and one special character',
      }
    ),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: 'Passwords do not match',
  path: ['confirmPassword'],
});

/**
 * Validation schema for user login
 */
export const loginSchema = z.object({
  email: z
    .string()
    .email({ message: 'Please enter a valid email address' }),
  password: z
    .string()
    .min(1, { message: 'Password is required' }),
});

/**
 * Validation schema for stream creation/update
 */
export const streamSchema = z.object({
  title: z
    .string()
    .min(1, { message: 'Stream title is required' })
    .max(100, { message: 'Stream title cannot exceed 100 characters' }),
  description: z
    .string()
    .max(500, { message: 'Description cannot exceed 500 characters' })
    .optional(),
  category: z
    .string()
    .optional(),
  tags: z
    .string()
    .max(100, { message: 'Tags cannot exceed 100 characters' })
    .optional(),
});

/**
 * Validation schema for chat messages
 */
export const chatMessageSchema = z.object({
  content: z
    .string()
    .min(1, { message: 'Message cannot be empty' })
    .max(200, { message: 'Message cannot exceed 200 characters' }),
});

/**
 * Validation schema for donations
 */
export const donationSchema = z.object({
  amount: z
    .number()
    .min(1, { message: 'Donation amount must be at least 1 coin' })
    .max(10000, { message: 'Donation amount cannot exceed 10,000 coins' }),
  message: z
    .string()
    .max(200, { message: 'Message cannot exceed 200 characters' })
    .optional(),
  streamId: z.string().uuid({ message: 'Invalid stream ID' }),
  receiverId: z.string().uuid({ message: 'Invalid receiver ID' }),
});

/**
 * Validation schema for user profile update
 */
export const profileUpdateSchema = z.object({
  displayName: z
    .string()
    .max(50, { message: 'Display name cannot exceed 50 characters' })
    .optional(),
  bio: z
    .string()
    .max(500, { message: 'Bio cannot exceed 500 characters' })
    .optional(),
  socialLinks: z
    .object({
      twitter: z.string().url({ message: 'Please enter a valid URL' }).optional().or(z.literal('')),
      instagram: z.string().url({ message: 'Please enter a valid URL' }).optional().or(z.literal('')),
      youtube: z.string().url({ message: 'Please enter a valid URL' }).optional().or(z.literal('')),
      twitch: z.string().url({ message: 'Please enter a valid URL' }).optional().or(z.literal('')),
      tiktok: z.string().url({ message: 'Please enter a valid URL' }).optional().or(z.literal('')),
    })
    .optional(),
});

/**
 * Validation schema for password change
 */
export const passwordChangeSchema = z.object({
  currentPassword: z.string().min(1, { message: 'Current password is required' }),
  newPassword: z
    .string()
    .min(8, { message: 'Password must be at least 8 characters long' })
    .refine(
      (password) => validatePasswordStrength(password).valid,
      {
        message:
          'Password must include at least one uppercase letter, one lowercase letter, one number, and one special character',
      }
    ),
  confirmNewPassword: z.string(),
}).refine((data) => data.newPassword === data.confirmNewPassword, {
  message: 'Passwords do not match',
  path: ['confirmNewPassword'],
});

/**
 * Validation schema for password reset request
 */
export const passwordResetRequestSchema = z.object({
  email: z
    .string()
    .email({ message: 'Please enter a valid email address' }),
});

/**
 * Validation schema for password reset
 */
export const passwordResetSchema = z.object({
  token: z.string().min(1, { message: 'Reset token is required' }),
  newPassword: z
    .string()
    .min(8, { message: 'Password must be at least 8 characters long' })
    .refine(
      (password) => validatePasswordStrength(password).valid,
      {
        message:
          'Password must include at least one uppercase letter, one lowercase letter, one number, and one special character',
      }
    ),
  confirmNewPassword: z.string(),
}).refine((data) => data.newPassword === data.confirmNewPassword, {
  message: 'Passwords do not match',
  path: ['confirmNewPassword'],
});

/**
 * Type definitions for validation schemas
 */
export type RegisterFormValues = z.infer<typeof registerSchema>;
export type LoginFormValues = z.infer<typeof loginSchema>;
export type StreamFormValues = z.infer<typeof streamSchema>;
export type ChatMessageFormValues = z.infer<typeof chatMessageSchema>;
export type DonationFormValues = z.infer<typeof donationSchema>;
export type ProfileUpdateFormValues = z.infer<typeof profileUpdateSchema>;
export type PasswordChangeFormValues = z.infer<typeof passwordChangeSchema>;
export type PasswordResetRequestFormValues = z.infer<typeof passwordResetRequestSchema>;
export type PasswordResetFormValues = z.infer<typeof passwordResetSchema>;
