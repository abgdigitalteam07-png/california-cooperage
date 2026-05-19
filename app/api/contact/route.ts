import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { name, email, postalCode, model, message } = body;

    if (!name || !email || !postalCode) {
      return NextResponse.json({ success: false, message: 'Missing required fields' }, { status: 400 });
    }

    // If Resend is configured, send email
    const apiKey = process.env.RESEND_API_KEY;
    const toEmail = process.env.CONTACT_TO_EMAIL || 'dealer@californiaspa.com';

    if (apiKey) {
      const emailBody = `
New Dealer Inquiry — ${model || 'General'}

Name: ${name}
Email: ${email}
Postal Code: ${postalCode}
Model of Interest: ${model || 'Not specified'}
Message: ${message || 'None'}
Timestamp: ${new Date().toISOString()}
      `.trim();

      await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          from: 'California Cooperage Website <noreply@californiaspa.com>',
          to: [toEmail],
          subject: `New Dealer Inquiry — ${model || 'General'}`,
          text: emailBody,
        }),
      });
    }

    return NextResponse.json({ success: true, message: 'Inquiry sent successfully' });
  } catch (err) {
    console.error('Contact form error:', err);
    return NextResponse.json({ success: false, message: 'Server error' }, { status: 500 });
  }
}
