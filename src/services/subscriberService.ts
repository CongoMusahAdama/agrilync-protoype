import api from '@/utils/api';

export type ResourceAccessPayload = {
  email: string;
  phone: string;
  resourceTitle: string;
};

export type SubscribeResponse = {
  success: boolean;
  msg: string;
  smsSent?: boolean;
  whatsappCommunityUrl?: string;
  subscriber?: {
    email: string;
    phone?: string;
    lastResource?: string;
    source?: string;
  };
};

export async function registerResourceAccess(
  payload: ResourceAccessPayload
): Promise<SubscribeResponse> {
  const { data } = await api.post<SubscribeResponse>('/blogs/subscribe', {
    email: payload.email.trim(),
    phone: payload.phone.trim(),
    resourceTitle: payload.resourceTitle,
    source: 'resources-access',
  });
  return data;
}

export function getSubscribeErrorMessage(err: unknown): string {
  if (err && typeof err === 'object' && 'response' in err) {
    const response = (err as { response?: { data?: { msg?: string } } }).response;
    if (response?.data?.msg) return response.data.msg;
  }
  if (err instanceof Error && err.message) return err.message;
  return 'Something went wrong. Please try again.';
}
