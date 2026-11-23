/**
 * Centralized API configuration helper for FoodAI Merchant.
 * Automatically resolves the live API URL on dqserv.com domains
 * and falls back to localhost during local development.
 */
export function getApiUrl(): string {
  // 1. In browser, if on dqserv.com, ALWAYS use the official dqserv API domain
  if (typeof window !== 'undefined') {
    if (window.location.hostname.includes('dqserv.com')) {
      return 'https://foodai-api.dqserv.com';
    }
  }

  // 2. If valid env var is provided (and not stale onrender URL)
  if (
    process.env.NEXT_PUBLIC_API_URL &&
    !process.env.NEXT_PUBLIC_API_URL.includes('onrender.com')
  ) {
    return process.env.NEXT_PUBLIC_API_URL;
  }

  // 3. Fallback to official production API
  return 'https://foodai-api.dqserv.com';
}

export function getSocketUrl(): string {
  if (typeof window !== 'undefined') {
    if (window.location.hostname.includes('dqserv.com')) {
      return 'https://foodai-api.dqserv.com';
    }
  }

  if (
    process.env.NEXT_PUBLIC_SOCKET_URL &&
    !process.env.NEXT_PUBLIC_SOCKET_URL.includes('onrender.com')
  ) {
    return process.env.NEXT_PUBLIC_SOCKET_URL;
  }

  return 'https://foodai-api.dqserv.com';
}
