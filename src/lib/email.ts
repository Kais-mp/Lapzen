import nodemailer from 'nodemailer';

function generateOrderConfirmationHTML({
  orderId,
  customerName,
  totalAmount,
  items,
  paymentMethod,
  address,
  phone,
}: {
  orderId: string;
  customerName: string;
  totalAmount: number;
  items: any[];
  paymentMethod: string;
  address: string;
  phone: string;
}): string {
  const itemsHTML = items
    .map(
      (item) =>
        `<tr>
          <td style="padding: 12px; border-bottom: 1px solid #e5e7eb;">${item.name}</td>
          <td style="padding: 12px; border-bottom: 1px solid #e5e7eb; text-align: center;">${item.quantity}</td>
          <td style="padding: 12px; border-bottom: 1px solid #e5e7eb; text-align: right;">Rs. ${item.price.toLocaleString()}</td>
          <td style="padding: 12px; border-bottom: 1px solid #e5e7eb; text-align: right;">Rs. ${(item.quantity * item.price).toLocaleString()}</td>
        </tr>`
    )
    .join('');

  return `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="UTF-8">
        <style>
          body { font-family: Arial, sans-serif; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background-color: #003366; color: white; padding: 20px; text-align: center; border-radius: 8px 8px 0 0; }
          .header h1 { margin: 0; font-size: 28px; }
          .content { background-color: #f9fafb; padding: 20px; border: 1px solid #e5e7eb; }
          .order-details { background-color: white; padding: 15px; margin: 15px 0; border-radius: 6px; }
          .order-details h3 { margin-top: 0; color: #003366; }
          table { width: 100%; border-collapse: collapse; margin: 15px 0; }
          table th { background-color: #f3f4f6; padding: 12px; text-align: left; font-weight: bold; color: #003366; }
          .total-row { background-color: #f0f0f0; font-weight: bold; }
          .footer { background-color: #f3f4f6; padding: 20px; text-align: center; font-size: 12px; color: #666; border-radius: 0 0 8px 8px; }
          .status-badge { display: inline-block; padding: 8px 12px; background-color: #10b981; color: white; border-radius: 4px; font-weight: bold; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>🛍️ Order Confirmed!</h1>
          </div>
          
          <div class="content">
            <p>Dear <strong>${customerName}</strong>,</p>
            
            <p>Thank you for your order! We're excited to get your items ready for delivery. Here's your order summary:</p>
            
            <div class="order-details">
              <h3>📦 Order Information</h3>
              <p><strong>Order ID:</strong> ${orderId}</p>
              <p><strong>Order Date:</strong> ${new Date().toLocaleDateString('en-PK', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
              <p><strong>Payment Method:</strong> ${paymentMethod === 'order_on_whatsapp' ? 'Order on WhatsApp' : paymentMethod === 'cash_on_delivery' ? 'Cash on Delivery' : paymentMethod}</p>
              <p><span class="status-badge">✓ Pending Confirmation</span></p>
            </div>
            
            <div class="order-details">
              <h3>📋 Ordered Items</h3>
              <table>
                <thead>
                  <tr>
                    <th>Product Name</th>
                    <th>Qty</th>
                    <th>Unit Price</th>
                    <th>Total</th>
                  </tr>
                </thead>
                <tbody>
                  ${itemsHTML}
                  <tr class="total-row">
                    <td colspan="3" style="padding: 12px; text-align: right;">Total Amount:</td>
                    <td style="padding: 12px; text-align: right;">Rs. ${totalAmount.toLocaleString()}</td>
                  </tr>
                </tbody>
              </table>
            </div>
            
            <div class="order-details">
              <h3>📍 Delivery Address</h3>
              <p>
                <strong>${customerName}</strong><br>
                ${address}<br>
                Phone: ${phone}
              </p>
            </div>
            
            <div class="order-details">
              <h3>✅ What's Next?</h3>
              <ul style="margin: 10px 0; padding-left: 20px;">
                <li>Our team will review your order within the next 24 hours</li>
                <li>We'll confirm the payment details via WhatsApp or email</li>
                <li>Once approved, your order will be dispatched</li>
                <li>You'll receive tracking information shortly</li>
              </ul>
            </div>
            
            <div class="order-details">
              <h3>💬 Need Help?</h3>
              <p>Have questions? Reach out to us anytime:</p>
              <p>
                📞 <strong>Phone:</strong> 0309-0009022<br>
                💬 <strong>WhatsApp:</strong> <a href="https://wa.me/923090009022" style="color: #003366;">Chat with us</a><br>
                📧 <strong>Email Support Available</strong>
              </p>
            </div>
          </div>
          
          <div class="footer">
            <p><strong>Lapzen - Premium Laptop Store</strong></p>
            <p>Thank you for shopping with us! We appreciate your business.</p>
            <p>© 2026 Lapzen. All rights reserved. | <a href="https://lapzen.pk" style="color: #003366; text-decoration: none;">www.lapzen.pk</a></p>
          </div>
        </div>
      </body>
    </html>
  `;
}

export async function sendOrderConfirmationEmail({
  email,
  orderId,
  customerName,
  totalAmount,
  items,
  paymentMethod = 'unknown',
  address = '',
  phone = '',
}: {
  email: string;
  orderId: string;
  customerName: string;
  totalAmount: number;
  items: any[];
  paymentMethod?: string;
  address?: string;
  phone?: string;
}) {
  try {
    // Check for required environment variables
    const smtpHost = process.env.SMTP_HOST || 'smtp-relay.brevo.com';
    const smtpPort = parseInt(process.env.SMTP_PORT || '587');
    const smtpUser = process.env.SMTP_USER;
    const smtpPass = process.env.SMTP_PASSWORD;
    const senderEmail = process.env.SENDER_EMAIL || 'lapzen.store@gmail.com';
    const senderName = process.env.SENDER_NAME || 'Lapzen';

    // If SMTP credentials are not configured, log and return success
    if (!smtpUser || !smtpPass) {
      console.log(`⚠️ Email sending skipped - SMTP credentials not configured for ${email} (Order: ${orderId})`);
      console.log(`📧 Email would be sent to: ${email}`);
      console.log(`📦 Order ID: ${orderId}`);
      return {
        success: true,
        data: { message: 'Email service not configured - contact administrator', orderId },
        error: null,
      };
    }

    // Create nodemailer transporter
    const transporter = nodemailer.createTransport({
      host: smtpHost,
      port: smtpPort,
      secure: smtpPort === 465, // true for 465, false for other ports
      auth: {
        user: smtpUser,
        pass: smtpPass,
      },
    });

    // Generate HTML content
    const htmlContent = generateOrderConfirmationHTML({
      orderId,
      customerName,
      totalAmount,
      items,
      paymentMethod,
      address,
      phone,
    });

    // Send email
    const info = await transporter.sendMail({
      from: `${senderName} <${senderEmail}>`,
      to: email,
      subject: `Order Confirmation - ${orderId} | Lapzen`,
      html: htmlContent,
      replyTo: senderEmail,
    });

    console.log(`✅ Order confirmation email sent to: ${email}`);
    console.log(`📧 Message ID: ${info.messageId}`);
    console.log(`📦 Order ID: ${orderId}`);

    return {
      success: true,
      data: { message: 'Order confirmation email sent successfully', orderId, messageId: info.messageId },
      error: null,
    };
  } catch (error) {
    console.error('❌ Error sending confirmation email:', error);
    return {
      success: false,
      data: null,
      error: error instanceof Error ? error.message : 'Unknown error occurred',
    };
  }
}
