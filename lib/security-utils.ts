/**
 * Security utility functions for the Fieldhouse application
 */

// Use the Web Crypto API instead of Node.js crypto module
// This works in both browser and Node.js environments in Next.js

/**
 * Generate a secure random token of specified length
 * @param length Length of the token to generate
 * @returns A secure random token string
 */
export function generateSecureToken(length: number = 32): string {
  const array = new Uint8Array(length);
  crypto.getRandomValues(array);
  return Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('');
}

/**
 * Hash a password with a salt using Web Crypto API
 * @param password The password to hash
 * @param salt Optional salt (will be generated if not provided)
 * @returns Promise resolving to an object containing the hash and salt
 */
export async function hashPassword(password: string, salt?: string): Promise<{ hash: string; salt: string }> {
  // Generate a salt if not provided
  const passwordSalt = salt || generateSecureToken(16);
  
  // Convert password and salt to ArrayBuffer
  const encoder = new TextEncoder();
  const passwordData = encoder.encode(password);
  const saltData = encoder.encode(passwordSalt);
  
  // Combine password and salt
  const combinedData = new Uint8Array(passwordData.length + saltData.length);
  combinedData.set(passwordData);
  combinedData.set(saltData, passwordData.length);
  
  // Hash the combined data using SHA-256
  const hashBuffer = await crypto.subtle.digest('SHA-256', combinedData);
  
  // Convert hash to hex string
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  
  return { hash: hashHex, salt: passwordSalt };
}

/**
 * Verify a password against a stored hash and salt
 * @param password The password to verify
 * @param storedHash The stored hash to compare against
 * @param salt The salt used for the stored hash
 * @returns Promise resolving to a boolean indicating if the password is valid
 */
export async function verifyPassword(password: string, storedHash: string, salt: string): Promise<boolean> {
  const { hash } = await hashPassword(password, salt);
  return hash === storedHash;
}

/**
 * Sanitize user input to prevent XSS attacks
 * @param input The user input to sanitize
 * @returns Sanitized string
 */
export function sanitizeInput(input: string): string {
  if (!input) return '';
  
  return input
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;')
    .replace(/\//g, '&#x2F;');
}

/**
 * Generate a CSRF token for form protection
 * @returns A secure CSRF token
 */
export function generateCSRFToken(): string {
  return generateSecureToken(32);
}

/**
 * Validate that a string contains only alphanumeric characters and allowed symbols
 * @param input The string to validate
 * @param allowedSymbols Additional symbols to allow
 * @returns Boolean indicating if the string is valid
 */
export function validateAlphanumeric(input: string, allowedSymbols: string = ''): boolean {
  if (!input) return false;
  
  const pattern = new RegExp(`^[a-zA-Z0-9${allowedSymbols.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&')}]+$`);
  return pattern.test(input);
}

/**
 * Validate an email address format
 * @param email The email address to validate
 * @returns Boolean indicating if the email format is valid
 */
export function validateEmail(email: string): boolean {
  if (!email) return false;
  
  // Basic email validation regex
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

/**
 * Validate password strength
 * @param password The password to validate
 * @param minLength Minimum required length (default: 8)
 * @param requireUppercase Require at least one uppercase letter
 * @param requireLowercase Require at least one lowercase letter
 * @param requireNumbers Require at least one number
 * @param requireSymbols Require at least one special character
 * @returns Object with validation result and reason if invalid
 */
export function validatePasswordStrength(
  password: string,
  minLength: number = 8,
  requireUppercase: boolean = true,
  requireLowercase: boolean = true,
  requireNumbers: boolean = true,
  requireSymbols: boolean = true
): { valid: boolean; reason?: string } {
  if (!password) {
    return { valid: false, reason: 'Password is required' };
  }
  
  if (password.length < minLength) {
    return { valid: false, reason: `Password must be at least ${minLength} characters long` };
  }
  
  if (requireUppercase && !/[A-Z]/.test(password)) {
    return { valid: false, reason: 'Password must contain at least one uppercase letter' };
  }
  
  if (requireLowercase && !/[a-z]/.test(password)) {
    return { valid: false, reason: 'Password must contain at least one lowercase letter' };
  }
  
  if (requireNumbers && !/[0-9]/.test(password)) {
    return { valid: false, reason: 'Password must contain at least one number' };
  }
  
  if (requireSymbols && !/[^A-Za-z0-9]/.test(password)) {
    return { valid: false, reason: 'Password must contain at least one special character' };
  }
  
  return { valid: true };
}

/**
 * Rate limiting helper - returns true if the action should be allowed
 * @param key Unique identifier for the action (e.g., IP address or user ID)
 * @param maxAttempts Maximum number of attempts allowed
 * @param timeWindowMs Time window in milliseconds
 * @param store Storage for rate limiting data (defaults to a Map)
 * @returns Boolean indicating if the action should be allowed
 */
export function rateLimit(
  key: string,
  maxAttempts: number,
  timeWindowMs: number,
  store: Map<string, { attempts: number; resetTime: number }> = new Map()
): boolean {
  const now = Date.now();
  const record = store.get(key);
  
  // If no record exists or the reset time has passed, create a new record
  if (!record || now > record.resetTime) {
    store.set(key, {
      attempts: 1,
      resetTime: now + timeWindowMs,
    });
    return true;
  }
  
  // If the maximum attempts have been reached, deny the request
  if (record.attempts >= maxAttempts) {
    return false;
  }
  
  // Increment the attempts counter
  record.attempts += 1;
  store.set(key, record);
  
  return true;
}

// Account lockout store - maps user IDs or IP addresses to lockout information
const accountLockoutStore = new Map<string, { 
  failedAttempts: number; 
  lockoutUntil: number | null;
  lastFailedAttempt: number;
}>();

/**
 * Account lockout system to prevent brute force attacks
 * @param identifier User identifier (email, username, or IP address)
 * @param isSuccessfulLogin Whether the login attempt was successful
 * @param maxFailedAttempts Maximum number of failed attempts before lockout (default: 5)
 * @param lockoutDurationMs Duration of lockout in milliseconds (default: 15 minutes)
 * @param resetAfterMs Reset failed attempts counter after this duration of inactivity (default: 1 hour)
 * @returns Object with lockout status and remaining lockout time
 */
export function handleLoginAttempt(
  identifier: string,
  isSuccessfulLogin: boolean,
  maxFailedAttempts: number = 5,
  lockoutDurationMs: number = 15 * 60 * 1000, // 15 minutes
  resetAfterMs: number = 60 * 60 * 1000 // 1 hour
): { 
  isLockedOut: boolean; 
  remainingLockoutMs: number | null;
  failedAttempts: number;
} {
  const now = Date.now();
  const record = accountLockoutStore.get(identifier) || { 
    failedAttempts: 0, 
    lockoutUntil: null,
    lastFailedAttempt: 0
  };
  
  // Check if the account is currently locked out
  if (record.lockoutUntil && now < record.lockoutUntil) {
    const remainingLockoutMs = record.lockoutUntil - now;
    return { 
      isLockedOut: true, 
      remainingLockoutMs, 
      failedAttempts: record.failedAttempts 
    };
  }
  
  // Reset lockout if it has expired
  if (record.lockoutUntil && now >= record.lockoutUntil) {
    record.lockoutUntil = null;
  }
  
  // Reset failed attempts if enough time has passed since last attempt
  if (now - record.lastFailedAttempt > resetAfterMs) {
    record.failedAttempts = 0;
  }
  
  // If login is successful, reset failed attempts
  if (isSuccessfulLogin) {
    record.failedAttempts = 0;
    record.lockoutUntil = null;
    accountLockoutStore.set(identifier, record);
    return { isLockedOut: false, remainingLockoutMs: null, failedAttempts: 0 };
  }
  
  // Increment failed attempts for unsuccessful login
  record.failedAttempts += 1;
  record.lastFailedAttempt = now;
  
  // Lock the account if max failed attempts reached
  if (record.failedAttempts >= maxFailedAttempts) {
    record.lockoutUntil = now + lockoutDurationMs;
  }
  
  accountLockoutStore.set(identifier, record);
  
  return {
    isLockedOut: record.lockoutUntil !== null,
    remainingLockoutMs: record.lockoutUntil ? record.lockoutUntil - now : null,
    failedAttempts: record.failedAttempts
  };
}

/**
 * Check if an account is currently locked out
 * @param identifier User identifier (email, username, or IP address)
 * @returns Object with lockout status and remaining lockout time
 */
export function checkAccountLockout(identifier: string): { 
  isLockedOut: boolean; 
  remainingLockoutMs: number | null;
  failedAttempts: number;
} {
  const now = Date.now();
  const record = accountLockoutStore.get(identifier);
  
  if (!record) {
    return { isLockedOut: false, remainingLockoutMs: null, failedAttempts: 0 };
  }
  
  if (record.lockoutUntil && now < record.lockoutUntil) {
    return { 
      isLockedOut: true, 
      remainingLockoutMs: record.lockoutUntil - now, 
      failedAttempts: record.failedAttempts 
    };
  }
  
  return { 
    isLockedOut: false, 
    remainingLockoutMs: null, 
    failedAttempts: record.failedAttempts 
  };
}
