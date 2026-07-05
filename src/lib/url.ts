/**
 * Utility to resolve relative image paths into absolute URLs.
 * In development, it points to localhost or dynamic local IP.
 * In production, it uses the provided API URL.
 */

export const DEFAULT_USER_AVATAR = `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="%23FDA4AF" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" style="background-color:%23FFF1F2;width:100%25;height:100%25;display:block;"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" fill="%23FFE4E6"/><circle cx="12" cy="7" r="4" fill="%23FECDD3"/></svg>`;

const getApiBaseUrl = () => {
  // Use the env variable or default to the local/production URL
  // We strip '/api' because static files (/uploads) are usually served from the root
  let apiUri = import.meta.env.VITE_API_URL;
  if (!apiUri) {
    // If not set, check if we are running locally (localhost, 127.0.0.1, or private local network IP ranges)
    const host = window.location.hostname;
    const isLocal = host === 'localhost' || 
                    host === '127.0.0.1' || 
                    host.startsWith('192.168.') || 
                    host.startsWith('10.') || 
                    host.startsWith('172.16.') || 
                    host.startsWith('172.31.');
                    
    apiUri = isLocal 
      ? `http://${host}:5000/api` 
      : '/api'; // No hardcoded domain — VITE_API_URL must be set for production
  }
  return apiUri.replace(/\/api\/?$/, '');
};

/**
 * Resolves a path (like /uploads/abc.jpg) to a full URL.
 * If the path is already an absolute URL, it returns it as-is.
 */
export const resolveImageUrl = (path?: string | null): string => {
  if (!path) return '';
  
  if (path.startsWith('http') || path.startsWith('data:')) return path;

  // Normalize backslashes (Windows) to forward slashes
  let normalizedPath = path.replace(/\\/g, '/');

  // Strip redundant leading slashes
  normalizedPath = normalizedPath.replace(/^\/+/, '');

  // Ensure it starts with uploads/ if it doesn't already
  if (!normalizedPath.startsWith('uploads/')) {
    normalizedPath = `uploads/${normalizedPath}`;
  }
  
  return `${getApiBaseUrl()}/${normalizedPath}`;
};

