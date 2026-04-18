/**
 * Utility to resolve relative image paths into absolute URLs.
 * In development, it points to localhost. 
 * In production, it uses the provided API URL.
 */

const getApiBaseUrl = () => {
  // Use the env variable or default to the Render URL
  // We strip '/api' because static files (/uploads) are usually served from the root
  const apiUri = import.meta.env.VITE_API_URL || 'https://vivahvedh-api.onrender.com/api';
  return apiUri.replace(/\/api\/?$/, '');
};

/**
 * Resolves a path (like /uploads/abc.jpg) to a full URL.
 * If the path is already an absolute URL, it returns it as-is.
 */
export const resolveImageUrl = (path?: string | null): string => {
  if (!path) return '';
  
  if (path.startsWith('http')) return path;

  // If it's just a filename (no slashes), it's likely an old record or payment screenshot
  // that needs the /uploads/ prefix.
  let cleanPath = path;
  if (!path.includes('/')) {
    cleanPath = `/uploads/${path}`;
  } else if (!path.startsWith('/')) {
    cleanPath = `/${path}`;
  }
  
  return `${getApiBaseUrl()}${cleanPath}`;
};
