import { NextRequest, NextResponse } from 'next/server';
import { sendContactEmail, sendAutoReply } from '@/lib/email';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, email, message } = body;

    // Validate required fields
    if (!name || !email || !message) {
      return NextResponse.json(
        { error: 'All fields are required' },
        { status: 400 }
      );
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: 'Invalid email format' },
        { status: 400 }
      );
    }

    // Check if email service is configured
    if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
      console.log('Email service not configured. Logging contact form submission:', {
        name,
        email,
        message,
        timestamp: new Date().toISOString()
      });
      
      return NextResponse.json(
        { message: 'Message received! (Email service not configured - check console for details)' },
        { status: 200 }
      );
    }

    // Send email notification to you
    const emailResult = await sendContactEmail({ name, email, message });
    
    if (!emailResult.success) {
      console.error('Failed to send contact email:', emailResult.error);
      return NextResponse.json(
        { error: 'Failed to send notification email' },
        { status: 500 }
      );
    }

    // Send auto-reply to the sender
    const autoReplyResult = await sendAutoReply({ name, email, message });
    
    if (!autoReplyResult.success) {
      console.error('Failed to send auto-reply:', autoReplyResult.error);
      // Don't fail the request if auto-reply fails, just log it
    }

    // Log the submission for your records
    console.log('New contact form submission:', {
      name,
      email,
      message,
      timestamp: new Date().toISOString(),
      userAgent: request.headers.get('user-agent') || 'unknown'
    });

    return NextResponse.json(
      { message: 'Message sent successfully!' },
      { status: 200 }
    );

  } catch (error) {
    console.error('Contact form error:', error);
    return NextResponse.json(
      { error: 'Failed to send message. Please try again.' },
      { status: 500 }
    );
  }
}

// Handle GET requests (optional - for testing)
export async function GET() {
  return NextResponse.json(
    { message: 'Contact API is working' },
    { status: 200 }
  );
}
