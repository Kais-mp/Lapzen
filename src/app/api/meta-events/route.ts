import { NextRequest, NextResponse } from 'next/server';
import { sendMetaEvent } from '@/lib/meta-capi';

export async function POST(req: NextRequest) {
  try {
    let body;
    try {
      body = await req.json();
    } catch {
      return NextResponse.json({ success: false, error: 'Invalid JSON body' }, { status: 400 });
    }
    
    if (!body || !body.eventName) {
      return NextResponse.json({ success: false, error: 'Missing eventName' }, { status: 400 });
    }
    const { eventName, eventSourceUrl, userData, customData, eventId } = body;

    const clientIpAddress = req.headers.get('x-forwarded-for') || req.headers.get('x-real-ip') || '';
    const clientUserAgent = req.headers.get('user-agent') || '';

    const result = await sendMetaEvent({
      eventName,
      eventSourceUrl: eventSourceUrl || req.headers.get('referer') || '',
      userData: {
        ...userData,
        clientIpAddress,
        clientUserAgent,
      },
      customData,
      eventId,
    });

    return NextResponse.json({ success: true, result });
  } catch (error: any) {
    console.error('Error in Meta CAPI route:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
