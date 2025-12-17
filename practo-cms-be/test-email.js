// Quick email test
import { sendEmail } from './src/modules/notifications/email.service.js';

async function testEmail() {
  console.log('🧪 Testing email service...');
  
  const result = await sendEmail({
    to: 'test@example.com', // Replace with your email
    subject: 'Test Email - Practo CMS',
    html: '<h1>Email works! 🎉</h1><p>Your forgot password feature is ready to implement.</p>'
  });
  
  console.log('📧 Email test result:', result ? '✅ SUCCESS' : '❌ FAILED');
}

testEmail();