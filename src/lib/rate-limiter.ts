/**
 * Simple in-memory sliding-window rate limiter for API routes.
 * Tracks request timestamps per client IP.
 */

interface RateLimitRecord {
  timestamps: number[];
}

const ipMap = new Map<string, RateLimitRecord>();

// Cleanup stale records every 5 minutes to prevent memory leak
const CLEANUP_INTERVAL_MS = 5 * 60 * 1000;
let lastCleanup = Date.now();

function cleanupStale(windowMs: number) {
  const now = Date.now();
  if (now - lastCleanup < CLEANUP_INTERVAL_MS) return;
  lastCleanup = now;

  const threshold = now - windowMs;
  for (const [ip, record] of ipMap.entries()) {
    record.timestamps = record.timestamps.filter((t) => t > threshold);
    if (record.timestamps.length === 0) {
      ipMap.delete(ip);
    }
  }
}

/**
 * Checks if a given IP has exceeded the limit.
 * @param ip Client IP address or fallback identifier
 * @param limit Max allowed requests within window (default 30)
 * @param windowMs Time window in milliseconds (default 60,000ms = 1 min)
 * @returns { success: boolean, remaining: number, resetMs: number }
 */
export function checkRateLimit(
  ip: string,
  limit: number = 30,
  windowMs: number = 60_000
): { success: boolean; remaining: number; resetMs: number } {
  cleanupStale(windowMs);

  const now = Date.now();
  const threshold = now - windowMs;

  let record = ipMap.get(ip);
  if (!record) {
    record = { timestamps: [] };
    ipMap.set(ip, record);
  }

  // Remove timestamps outside current window
  record.timestamps = record.timestamps.filter((t) => t > threshold);

  if (record.timestamps.length >= limit) {
    const oldest = record.timestamps[0];
    const resetMs = Math.max(0, oldest + windowMs - now);
    return {
      success: false,
      remaining: 0,
      resetMs,
    };
  }

  record.timestamps.push(now);
  return {
    success: true,
    remaining: limit - record.timestamps.length,
    resetMs: windowMs,
  };
}
