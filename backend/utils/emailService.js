const nodemailer = require('nodemailer');

class EmailService {
  constructor() {
    // Create transporter with configuration from environment variables
    this.transporter = nodemailer.createTransporter({
      host: process.env.EMAIL_HOST || 'smtp.gmail.com',
      port: parseInt(process.env.EMAIL_PORT) || 587,
      secure: (process.env.EMAIL_SECURE === 'true') || false, // true for 465, false for other ports
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    // Verify transporter configuration
    this.transporter.verify((error, success) => {
      if (error) {
        console.error('Email service configuration error:', error);
      } else {
        console.log('Email service is ready to send messages');
      }
    });
  }

  async sendOTP(email, otp) {
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: 'Your OTP Code for Registration',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #333;">Email Verification</h2>
          <p>Hello,</p>
          <p>Thank you for registering! Your OTP code is:</p>
          <div style="text-align: center; margin: 30px 0;">
            <span style="font-size: 32px; font-weight: bold; background: #f0f0f0; padding: 10px 20px; border-radius: 5px; letter-spacing: 3px; display: inline-block;">
              ${otp}
            </span>
          </div>
          <p>This code will expire in 2 minutes.</p>
          <p>If you didn't request this, please ignore this email.</p>
          <br>
          <p>Best regards,<br>The Team</p>
        </div>
      `,
    };

    try {
      // Check if email configuration is valid
      if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
        console.error('Email configuration is missing EMAIL_USER or EMAIL_PASS');
        return { success: false, error: 'Email configuration is incomplete' };
      }

      const result = await this.transporter.sendMail(mailOptions);
      console.log('Email sent successfully:', result.messageId);
      return { success: true, messageId: result.messageId };
    } catch (error) {
      console.error('Error sending email:', error);
      console.error('Email error details:', {
        email: email,
        otp: otp,
        host: process.env.EMAIL_HOST,
        port: process.env.EMAIL_PORT,
        user: process.env.EMAIL_USER ? 'configured' : 'missing',
        pass: process.env.EMAIL_PASS ? 'configured' : 'missing'
      });
      return { success: false, error: error.message };
    }
  }
}

module.exports = new EmailService();