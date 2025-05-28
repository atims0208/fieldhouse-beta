/**
 * Session management utilities for the Fieldhouse application
 */

import { generateSecureToken } from './security-utils';

// Session store - maps session IDs to session data
const sessionStore = new Map<string, {
  userId: string;
  data: Record<string, any>;
  createdAt: number;
  expiresAt: number;
  lastActivity: number;
}>();

// Default session expiration time (24 hours)
const DEFAULT_SESSION_EXPIRATION_MS = 24 * 60 * 60 * 1000;

// Default session inactivity timeout (1 hour)
const DEFAULT_INACTIVITY_TIMEOUT_MS = 60 * 60 * 1000;

/**
 * Create a new session
 * @param userId User ID associated with the session
 * @param initialData Initial session data
 * @param expirationMs Session expiration time in milliseconds (default: 24 hours)
 * @returns Session ID and expiration timestamp
 */
export function createSession(
  userId: string,
  initialData: Record<string, any> = {},
  expirationMs: number = DEFAULT_SESSION_EXPIRATION_MS
): { sessionId: string; expiresAt: number } {
  // Generate a secure session ID
  const sessionId = generateSecureToken(48);
  
  // Calculate expiration time
  const now = Date.now();
  const expiresAt = now + expirationMs;
  
  // Store session data
  sessionStore.set(sessionId, {
    userId,
    data: initialData,
    createdAt: now,
    expiresAt,
    lastActivity: now,
  });
  
  return { sessionId, expiresAt };
}

/**
 * Get session data
 * @param sessionId Session ID
 * @param updateLastActivity Whether to update the last activity timestamp (default: true)
 * @returns Session data or null if session is invalid or expired
 */
export function getSession(
  sessionId: string,
  updateLastActivity: boolean = true
): { userId: string; data: Record<string, any>; expiresAt: number } | null {
  // Get session from store
  const session = sessionStore.get(sessionId);
  
  // Check if session exists
  if (!session) {
    return null;
  }
  
  const now = Date.now();
  
  // Check if session has expired
  if (now > session.expiresAt) {
    // Remove expired session
    sessionStore.delete(sessionId);
    return null;
  }
  
  // Check for inactivity timeout
  if (now - session.lastActivity > DEFAULT_INACTIVITY_TIMEOUT_MS) {
    // Remove inactive session
    sessionStore.delete(sessionId);
    return null;
  }
  
  // Update last activity timestamp
  if (updateLastActivity) {
    session.lastActivity = now;
    sessionStore.set(sessionId, session);
  }
  
  return {
    userId: session.userId,
    data: session.data,
    expiresAt: session.expiresAt,
  };
}

/**
 * Update session data
 * @param sessionId Session ID
 * @param data Data to update (will be merged with existing data)
 * @returns Boolean indicating if the update was successful
 */
export function updateSession(
  sessionId: string,
  data: Record<string, any>
): boolean {
  // Get session from store
  const session = sessionStore.get(sessionId);
  
  // Check if session exists and is valid
  if (!session || Date.now() > session.expiresAt) {
    return false;
  }
  
  // Update session data and last activity
  session.data = { ...session.data, ...data };
  session.lastActivity = Date.now();
  
  // Store updated session
  sessionStore.set(sessionId, session);
  
  return true;
}

/**
 * Extend session expiration
 * @param sessionId Session ID
 * @param expirationMs New expiration time in milliseconds from now
 * @returns New expiration timestamp or null if session is invalid
 */
export function extendSession(
  sessionId: string,
  expirationMs: number = DEFAULT_SESSION_EXPIRATION_MS
): number | null {
  // Get session from store
  const session = sessionStore.get(sessionId);
  
  // Check if session exists and is valid
  if (!session || Date.now() > session.expiresAt) {
    return null;
  }
  
  // Calculate new expiration time
  const newExpiresAt = Date.now() + expirationMs;
  
  // Update session expiration and last activity
  session.expiresAt = newExpiresAt;
  session.lastActivity = Date.now();
  
  // Store updated session
  sessionStore.set(sessionId, session);
  
  return newExpiresAt;
}

/**
 * Delete a session
 * @param sessionId Session ID
 * @returns Boolean indicating if the session was deleted
 */
export function deleteSession(sessionId: string): boolean {
  return sessionStore.delete(sessionId);
}

/**
 * Clean up expired sessions
 * @returns Number of sessions removed
 */
export function cleanupExpiredSessions(): number {
  let removedCount = 0;
  const now = Date.now();
  
  // Iterate through all sessions
  Array.from(sessionStore.entries()).forEach(([sessionId, session]) => {
    // Check if session has expired or is inactive
    if (
      now > session.expiresAt ||
      now - session.lastActivity > DEFAULT_INACTIVITY_TIMEOUT_MS
    ) {
      // Remove expired or inactive session
      sessionStore.delete(sessionId);
      removedCount++;
    }
  });
  
  return removedCount;
}

/**
 * Get all active sessions for a user
 * @param userId User ID
 * @returns Array of session IDs
 */
export function getUserSessions(userId: string): string[] {
  const userSessions: string[] = [];
  const now = Date.now();
  
  // Iterate through all sessions
  Array.from(sessionStore.entries()).forEach(([sessionId, session]) => {
    // Check if session belongs to user and is valid
    if (
      session.userId === userId &&
      now <= session.expiresAt &&
      now - session.lastActivity <= DEFAULT_INACTIVITY_TIMEOUT_MS
    ) {
      userSessions.push(sessionId);
    }
  });
  
  return userSessions;
}

/**
 * Delete all sessions for a user
 * @param userId User ID
 * @returns Number of sessions deleted
 */
export function deleteUserSessions(userId: string): number {
  let deletedCount = 0;
  
  // Iterate through all sessions
  Array.from(sessionStore.entries()).forEach(([sessionId, session]) => {
    // Check if session belongs to user
    if (session.userId === userId) {
      // Delete session
      sessionStore.delete(sessionId);
      deletedCount++;
    }
  });
  
  return deletedCount;
}

/**
 * Set up periodic cleanup of expired sessions
 * @param intervalMs Cleanup interval in milliseconds (default: 15 minutes)
 * @returns Cleanup interval ID (can be used with clearInterval)
 */
export function setupSessionCleanup(intervalMs: number = 15 * 60 * 1000): NodeJS.Timeout {
  return setInterval(cleanupExpiredSessions, intervalMs);
}
