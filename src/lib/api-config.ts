/**
 * Centralized API configuration helper for FoodAI Merchant.
 * Automatically resolves the live API URL on dqserv.com domains
 * and falls back to localhost during local development.
 */
export function getApiUrl(): string {
  if (process.env.NEXT_PUBLIC_API_URL) {
    return process.env.NEXT_PUBLIC_API_URL;
  }
  if (typeof window !== 'undefined') {
    if (window.location.hostname.includes('dqserv.com')) {
      return 'https://foodai-api.dqserv.com';
    }
  }
  return 'http://localhost:3001';
}

export function getSocketUrl(): string {
  if (process.env.NEXT_PUBLIC_SOCKET_URL) {
    return process.env.NEXT_PUBLIC_SOCKET_URL;
  }
  if (typeof window !== 'undefined') {
    if (window.location.hostname.includes('dqserv.com')) {
      return 'https://foodai-api.dqserv.com';
    }
  }
  return 'http://localhost:3001';
}
