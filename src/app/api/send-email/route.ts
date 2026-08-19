import { NextRequest, NextResponse } from 'next/server';
import { sendOrderConfirmationEmail } from '@/lib/email';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    const {
      email,
      orderId,
      customerName,
      totalAmount,
      items,
      paymentMethod,
      address,
      phone
    } = body;

    // Validate required fields
    if (!email || !orderId || !customerName || !totalAmount || !items) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Send confirmation email
    const result = await sendOrderConfirmationEmail({
      email,
      orderId,
      customerName,
      totalAmount,
      items,
      paymentMethod,
      address,
      phone
    });

    if (result.error) {
      console.error('Error sending email:', result.error);
      return NextResponse.json(
        { error: 'Failed to send confirmation email', details: result.error },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { success: true, message: 'Order confirmation email sent successfully', data: result.data },
      { status: 200 }
    );
  } catch (error) {
    console.error('Send email error:', error);
    return NextResponse.json(
      { error: 'Internal server error', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}
