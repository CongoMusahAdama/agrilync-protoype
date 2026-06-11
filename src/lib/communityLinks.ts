/** Public contact & community links — set in Netlify / local .env */

export const WHATSAPP_COMMUNITY_URL =
  import.meta.env.VITE_WHATSAPP_COMMUNITY_URL?.trim() || '';

export const CONTACT_WHATSAPP =
  import.meta.env.VITE_CONTACT_WHATSAPP?.trim() || '';

export const CONTACT_PHONE_SECONDARY =
  import.meta.env.VITE_CONTACT_PHONE_SECONDARY?.trim() || '';

export const CONTACT_EMAIL =
  import.meta.env.VITE_CONTACT_EMAIL?.trim() || '';

export const whatsappMeUrl = (text?: string) => {
  if (!CONTACT_WHATSAPP) return '#';
  const base = `https://wa.me/${CONTACT_WHATSAPP}`;
  return text ? `${base}?text=${encodeURIComponent(text)}` : base;
};

export const formatGhanaPhone = (digits: string) => {
  if (!digits || digits.length < 12) return digits;
  return `+${digits.slice(0, 3)} ${digits.slice(3, 6)} ${digits.slice(6, 9)} ${digits.slice(9)}`;
};
