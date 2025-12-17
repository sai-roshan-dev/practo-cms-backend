// Test forgot password functionality
import { sendEmail } from './src/modules/notifications/email.service.js';

async function testForgotPassword() {
  console.log('🧪 Testing forgot password email...');
  
  const resetToken = 'test-token-123';
  const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:3000';
  const resetLink = `${frontendUrl}/reset-password?token=${resetToken}`;
  
  const result = await sendEmail({
    to: 'test@example.com', // Replace with your email for testing
    subject: 'Reset Your Password - Practo CMS',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #333;">Reset Your Password</h2>
        <p>Hi Test User,</p>
        <p>You requested to reset your password for Practo CMS. Click the button below to reset it:</p>
        <div style="text-align: center; margin: 30px 0;">
          <a href="${resetLink}" style="background-color: #007bff; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; display: inline-block;">Reset Password</a>
        </div>
        <p>Or copy and paste this link in your browser:</p>
        <p style="word-break: break-all; color: #666;">${resetLink}</p>
        <p><strong>This link will expire in 30 minutes.</strong></p>
        <p>If you didn't request this, please ignore this email.</p>
        <hr style="margin: 30px 0; border: none; border-top: 1px solid #eee;">
        <p style="color: #666; font-size: 12px;">Practo CMS Team</p>
      </div>
    `
  });
  
  console.log('📧 Forgot password email test result:', result ? '✅ SUCCESS' : '❌ FAILED');
  console.log('🔗 Reset link would be:', resetLink);
}

testForgotPassword();