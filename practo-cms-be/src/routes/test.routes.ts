/**
 * Test Routes - Queue Testing
 */

import { Router } from 'express';
import { notificationQueue } from '../modules/notifications/queue.js';
import NotificationService from '../modules/notifications/notifications.service.js';

const router = Router();

// Test notification queue with real email
router.post('/notification', async (req, res) => {
  try {
    console.log('🧪 Testing notification queue with real email...');
    
    // Add test job to queue with real email to roshan.neelam@gamyam.co
    const job = await notificationQueue.add('send-notification', {
      eventType: 'TEST_NOTIFICATION',
      recipientIds: ['test-user-123'], // Dummy user ID for testing
      title: 'Practo CMS - Email Test Successful! 🎉',
      message: 'This is a test email from Practo CMS notification system. Redis + Bull queue + Resend email service is working perfectly!',
      metadata: { 
        test: true,
        timestamp: new Date().toISOString(),
        environment: 'production'
      },
      emailSubject: 'Practo CMS - Email Service Test ✅',
      emailHtml: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <h1 style="color: #2563eb; text-align: center;">🎉 Practo CMS Email Test</h1>
          <div style="background: #f0f9ff; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h2 style="color: #1e40af; margin-top: 0;">✅ Email Service Working!</h2>
            <p><strong>System Status:</strong> All components operational</p>
            <ul>
              <li>✅ Redis + Bull Queue: Working</li>
              <li>✅ Notification Service: Working</li>
              <li>✅ Resend Email Service: Working</li>
              <li>✅ Production Deployment: Working</li>
            </ul>
          </div>
          <div style="background: #ecfdf5; padding: 15px; border-radius: 8px; border-left: 4px solid #10b981;">
            <p><strong>📧 Test Details:</strong></p>
            <p>• Sent to: roshan.neelam@gamyam.co</p>
            <p>• From: noreply@gamyam.co</p>
            <p>• Time: ${new Date().toLocaleString()}</p>
            <p>• Environment: Production (Render)</p>
          </div>
          <p style="text-align: center; margin-top: 30px; color: #6b7280;">
            This confirms that the Practo CMS notification system is ready for production use!
          </p>
        </div>
      `
    });

    // Override recipient for test email
    const testEmailJob = await notificationQueue.add('send-test-email', {
      to: 'roshan.neelam@gamyam.co',
      subject: 'Practo CMS - Email Service Test ✅',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <h1 style="color: #2563eb; text-align: center;">🎉 Practo CMS Email Test</h1>
          <div style="background: #f0f9ff; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h2 style="color: #1e40af; margin-top: 0;">✅ Email Service Working!</h2>
            <p><strong>System Status:</strong> All components operational</p>
            <ul>
              <li>✅ Redis + Bull Queue: Working</li>
              <li>✅ Notification Service: Working</li>
              <li>✅ Resend Email Service: Working</li>
              <li>✅ Production Deployment: Working</li>
            </ul>
          </div>
          <div style="background: #ecfdf5; padding: 15px; border-radius: 8px; border-left: 4px solid #10b981;">
            <p><strong>📧 Test Details:</strong></p>
            <p>• Sent to: roshan.neelam@gamyam.co</p>
            <p>• From: noreply@gamyam.co</p>
            <p>• Time: ${new Date().toLocaleString()}</p>
            <p>• Environment: Production (Render)</p>
          </div>
          <p style="text-align: center; margin-top: 30px; color: #6b7280;">
            This confirms that the Practo CMS notification system is ready for production use!<br>
            In production, emails will be sent to actual user email addresses from the database.
          </p>
        </div>
      `
    });

    res.json({ 
      success: true, 
      message: 'Test email sent to roshan.neelam@gamyam.co - Check your inbox!',
      details: {
        recipient: 'roshan.neelam@gamyam.co',
        jobId: testEmailJob.id,
        timestamp: new Date().toISOString()
      }
    });
  } catch (error: any) {
    res.status(500).json({ 
      success: false, 
      error: error.message 
    });
  }
});

// Get queue stats
router.get('/queue-stats', async (req, res) => {
  try {
    // Test Redis connection first
    const redisUrl = process.env.REDIS_URL;
    if (!redisUrl) {
      return res.status(500).json({ error: 'REDIS_URL not configured' });
    }

    // Try to get queue stats with timeout
    const timeout = new Promise((_, reject) => 
      setTimeout(() => reject(new Error('Redis connection timeout')), 5000)
    );

    const statsPromise = Promise.all([
      notificationQueue.getWaiting(),
      notificationQueue.getActive(), 
      notificationQueue.getCompleted(),
      notificationQueue.getFailed()
    ]);

    const [waiting, active, completed, failed] = await Promise.race([statsPromise, timeout]) as [any[], any[], any[], any[]];

    res.json({
      status: 'connected',
      redisUrl: redisUrl.substring(0, 20) + '...', // Hide full URL
      waiting: waiting.length,
      active: active.length,
      completed: completed.length,
      failed: failed.length
    });
  } catch (error: any) {
    res.status(500).json({ 
      status: 'error',
      error: error.message,
      redisUrl: process.env.REDIS_URL ? 'configured' : 'missing'
    });
  }
});

export default router;