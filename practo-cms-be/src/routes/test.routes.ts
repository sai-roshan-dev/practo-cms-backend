/**
 * Test Routes - Queue Testing
 */

import { Router } from 'express';
import { notificationQueue } from '../modules/notifications/queue.js';
import NotificationService from '../modules/notifications/notifications.service.js';

const router = Router();

// Test notification queue
router.post('/notification', async (req, res) => {
  try {
    console.log('🧪 Testing notification queue...');
    
    // Add test job to queue (using email-only notification)
    const job = await notificationQueue.add('send-notification', {
      eventType: 'TEST_NOTIFICATION',
      recipientIds: [], // No in-app notifications
      title: 'Test Notification',
      message: 'Redis + Bull queue test',
      metadata: { test: true },
      emailSubject: 'Queue Test Email',
      emailHtml: '<h1>Success!</h1><p>Redis + Bull queue is working</p>'
    });

    res.json({ 
      success: true, 
      message: 'Test notification queued successfully' 
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
    const [waiting, active, completed, failed] = await Promise.all([
      notificationQueue.getWaiting(),
      notificationQueue.getActive(), 
      notificationQueue.getCompleted(),
      notificationQueue.getFailed()
    ]);

    res.json({
      waiting: waiting.length,
      active: active.length,
      completed: completed.length,
      failed: failed.length,
      jobs: {
        waiting: waiting.map(j => ({ id: j.id, data: j.data })),
        completed: completed.slice(-5).map(j => ({ id: j.id, data: j.data })),
        failed: failed.slice(-5).map(j => ({ id: j.id, data: j.data, error: j.failedReason }))
      }
    });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

export default router;