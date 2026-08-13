import nodemailer from 'nodemailer';

interface EmailOptions {
  to: string;
  subject: string;
  html: string;
  text?: string;
}

class EmailService {
  private transporter: nodemailer.Transporter | null = null;

  constructor() {
    this.initializeTransporter();
  }

  private initializeTransporter() {
    // In production, use real SMTP credentials
    // For development, we'll use a test account or ethereal.email
    if (process.env.EMAIL_HOST && process.env.EMAIL_USER && process.env.EMAIL_PASS) {
      this.transporter = nodemailer.createTransport({
        host: process.env.EMAIL_HOST,
        port: parseInt(process.env.EMAIL_PORT || '587'),
        secure: process.env.EMAIL_SECURE === 'true',
        auth: {
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_PASS,
        },
      });
    } else {
      // For development, create a test account
      this.createTestAccount();
    }
  }

  private async createTestAccount() {
    try {
      const testAccount = await nodemailer.createTestAccount();
      this.transporter = nodemailer.createTransport({
        host: 'smtp.ethereal.email',
        port: 587,
        secure: false,
        auth: {
          user: testAccount.user,
          pass: testAccount.pass,
        },
      });
      console.log('Test email account created:', testAccount.user);
    } catch (error) {
      console.error('Failed to create test email account:', error);
    }
  }

  async sendEmail(options: EmailOptions): Promise<boolean> {
    if (!this.transporter) {
      console.error('Email transporter not initialized');
      return false;
    }

    try {
      const info = await this.transporter.sendMail({
        from: process.env.EMAIL_FROM || 'VendSway <noreply@vendsway.com>',
        to: options.to,
        subject: options.subject,
        html: options.html,
        text: options.text,
      });

      console.log('Email sent:', info.messageId);
      
      // For ethereal test accounts, log the preview URL
      if (process.env.NODE_ENV !== 'production') {
        console.log('Preview URL:', nodemailer.getTestMessageUrl(info));
      }

      return true;
    } catch (error) {
      console.error('Failed to send email:', error);
      return false;
    }
  }

  async sendVerificationEmail(email: string, verificationToken: string, name: string): Promise<boolean> {
    const verificationUrl = `${process.env.FRONTEND_URL || 'http://localhost:5173'}/verify-email?token=${verificationToken}`;

    const html = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Verify Your Email</title>
        </head>
        <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
          <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
            <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; border-radius: 10px; margin-bottom: 20px;">
              <h1 style="color: white; margin: 0; font-size: 24px;">VendSway</h1>
              <p style="color: rgba(255,255,255,0.9); margin: 10px 0 0 0;">Regional Commerce Intelligence Platform</p>
            </div>
            
            <h2 style="color: #333; margin-bottom: 20px;">Verify Your Email Address</h2>
            
            <p>Hello ${name},</p>
            
            <p>Thank you for signing up for VendSway. To complete your registration, please verify your email address by clicking the button below:</p>
            
            <div style="text-align: center; margin: 30px 0;">
              <a href="${verificationUrl}" style="display: inline-block; padding: 15px 30px; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; text-decoration: none; border-radius: 5px; font-weight: bold;">Verify Email</a>
            </div>
            
            <p>Or copy and paste this link into your browser:</p>
            <p style="word-break: break-all; color: #666; background: #f5f5f5; padding: 10px; border-radius: 5px;">${verificationUrl}</p>
            
            <p style="margin-top: 30px; color: #666; font-size: 14px;">This link will expire in 24 hours.</p>
            
            <p style="margin-top: 20px;">If you didn't create an account with VendSway, you can safely ignore this email.</p>
            
            <div style="margin-top: 40px; padding-top: 20px; border-top: 1px solid #eee; color: #999; font-size: 12px;">
              <p>&copy; 2026 VendSway. All rights reserved.</p>
            </div>
          </div>
        </body>
      </html>
    `;

    const text = `
      VendSway - Verify Your Email Address
      
      Hello ${name},
      
      Thank you for signing up for VendSway. To complete your registration, please verify your email address by visiting:
      
      ${verificationUrl}
      
      This link will expire in 24 hours.
      
      If you didn't create an account with VendSway, you can safely ignore this email.
      
      © 2026 VendSway. All rights reserved.
    `;

    return this.sendEmail({
      to: email,
      subject: 'Verify Your Email Address - VendSway',
      html,
      text,
    });
  }

  async sendPasswordResetEmail(email: string, resetToken: string, name: string): Promise<boolean> {
    const resetUrl = `${process.env.FRONTEND_URL || 'http://localhost:5173'}/reset-password?token=${resetToken}`;

    const html = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Reset Your Password</title>
        </head>
        <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
          <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
            <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; border-radius: 10px; margin-bottom: 20px;">
              <h1 style="color: white; margin: 0; font-size: 24px;">VendSway</h1>
              <p style="color: rgba(255,255,255,0.9); margin: 10px 0 0 0;">Regional Commerce Intelligence Platform</p>
            </div>
            
            <h2 style="color: #333; margin-bottom: 20px;">Reset Your Password</h2>
            
            <p>Hello ${name},</p>
            
            <p>We received a request to reset your password for your VendSway account. Click the button below to reset your password:</p>
            
            <div style="text-align: center; margin: 30px 0;">
              <a href="${resetUrl}" style="display: inline-block; padding: 15px 30px; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; text-decoration: none; border-radius: 5px; font-weight: bold;">Reset Password</a>
            </div>
            
            <p>Or copy and paste this link into your browser:</p>
            <p style="word-break: break-all; color: #666; background: #f5f5f5; padding: 10px; border-radius: 5px;">${resetUrl}</p>
            
            <p style="margin-top: 30px; color: #666; font-size: 14px;">This link will expire in 1 hour.</p>
            
            <p style="margin-top: 20px;">If you didn't request a password reset, you can safely ignore this email.</p>
            
            <div style="margin-top: 40px; padding-top: 20px; border-top: 1px solid #eee; color: #999; font-size: 12px;">
              <p>&copy; 2026 VendSway. All rights reserved.</p>
            </div>
          </div>
        </body>
      </html>
    `;

    const text = `
      VendSway - Reset Your Password
      
      Hello ${name},
      
      We received a request to reset your password for your VendSway account. Visit the link below to reset your password:
      
      ${resetUrl}
      
      This link will expire in 1 hour.
      
      If you didn't request a password reset, you can safely ignore this email.
      
      © 2026 VendSway. All rights reserved.
    `;

    return this.sendEmail({
      to: email,
      subject: 'Reset Your Password - VendSway',
      html,
      text,
    });
  }
}

export const emailService = new EmailService();
