import { createHash } from 'crypto';

const PIXEL_ID = process.env.NEXT_PUBLIC_META_PIXEL_ID;
const ACCESS_TOKEN = process.env.META_ACCESS_TOKEN;

export function hashData(data: string) {
  if (!data) return '';
  return createHash('sha256').update(data.trim().toLowerCase()).digest('hex');
}

interface MetaUserData {
  email?: string;
  phone?: string;
  fbp?: string;
  fbc?: string;
  clientIpAddress?: string;
  clientUserAgent?: string;
}

interface MetaEventParams {
  eventName: string;
  eventSourceUrl: string;
  userData: MetaUserData;
  customData?: any;
  eventId?: string;
}

export async function sendMetaEvent({
  eventName,
  eventSourceUrl,
  userData,
  customData,
  eventId,
}: MetaEventParams) {
  if (!PIXEL_ID || !ACCESS_TOKEN) {
    return;
  }

  const payload = {
    data: [
      {
        event_name: eventName,
        event_time: Math.floor(Date.now() / 1000),
        action_source: 'website',
        event_source_url: eventSourceUrl,
        event_id: eventId,
        user_data: {
          em: userData.email ? [hashData(userData.email)] : undefined,
          ph: userData.phone ? [hashData(userData.phone)] : undefined,
          client_ip_address: userData.clientIpAddress,
          client_user_agent: userData.clientUserAgent,
          fbp: userData.fbp,
          fbc: userData.fbc,
        },
        custom_data: customData,
      },
    ],
  };

  try {
    const response = await fetch(
      `https://graph.facebook.com/v18.0/${PIXEL_ID}/events?access_token=${ACCESS_TOKEN}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      }
    );

    return await response.json();
  } catch (error) {
    console.error('Error sending Meta CAPI event:', error);
  }
}
