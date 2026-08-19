
import { createClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';
import { sendOrderConfirmationEmail } from '@/lib/email';

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  try {
    const payload = await request.json();
    console.log('Received Supabase Webhook payload:', payload);

    // Supabase Webhook payload structure:
    // { type: 'INSERT', table: 'orders', record: { ... }, old_record: null, ... }
    const { type, table, record } = payload;

    if (type === 'INSERT' && table === 'orders') {
      const { id, customer_details, total_amount, items } = record;

      if (customer_details?.email) {
        console.log(`Sending confirmation email to ${customer_details.email} for order ${id}`);
        const result = await sendOrderConfirmationEmail({
          email: customer_details.email,
          orderId: id,
          customerName: customer_details.name || 'Customer',
          totalAmount: total_amount,
          items: items || [],
        });

        if (result.success) {
          return NextResponse.json({ message: 'Email sent successfully' });
        } else {
          console.error('Failed to send email:', result.error);
          return NextResponse.json({ error: 'Failed to send email' }, { status: 500 });
        }
      } else {
        console.warn('No email found in customer_details');
        return NextResponse.json({ message: 'No email found, skipping' });
      }
    }

    return NextResponse.json({ message: 'Event ignored' });
  } catch (error) {
    console.error('Webhook error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
