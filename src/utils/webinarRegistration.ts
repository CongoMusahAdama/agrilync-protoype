import type { WebinarItem } from '@/data/webinars';
import { WHATSAPP_COMMUNITY_URL } from '@/lib/communityLinks';

export const FARM_RECORDS_EVENT_REGISTER_PATH = '/events/farm-records/register';

export function getWhatsAppCommunityUrl(): string {
  return WHATSAPP_COMMUNITY_URL;
}

/** Opens the correct registration destination (WhatsApp community, external link, etc.). */
export function openWebinarRegistration(webinar: WebinarItem): boolean {
  if (webinar.registrationChannel === 'whatsapp') {
    const url = WHATSAPP_COMMUNITY_URL;
    if (!url) return false;
    window.location.href = url;
    return true;
  }

  if (webinar.registrationLink) {
    window.location.href = webinar.registrationLink;
    return true;
  }

  if (webinar.id === 3) {
    window.location.href = 'https://is.gd/agrilyncwebinarnexus';
    return true;
  }

  return false;
}

export function webinarRegisterButtonLabel(webinar: WebinarItem): string {
  if (webinar.registered >= webinar.spots) return 'Fully Booked';
  if (webinar.registrationChannel === 'whatsapp') return 'Register on WhatsApp';
  return 'Register Now';
}
