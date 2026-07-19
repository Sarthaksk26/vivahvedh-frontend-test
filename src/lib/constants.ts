// Source of truth for business contact information.
// Import these constants instead of hardcoding duplicate values.

export const SUPPORT_PHONE = '+91 7447448844, +91 7507563392';
export const SUPPORT_EMAIL = 'vivahvedhgad@gmail.com';

/** WhatsApp contact number (digits only, with country code) */
export const WHATSAPP_NUMBER = '917447448744';
export const WHATSAPP_DISPLAY = '7447448744';

/** Returns a fully-qualified WhatsApp chat URL with an optional pre-filled message */
export const getWhatsAppUrl = (message = 'नमस्कार, मला विवाहवेध बद्दल अधिक माहिती हवी आहे.') =>
  `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
