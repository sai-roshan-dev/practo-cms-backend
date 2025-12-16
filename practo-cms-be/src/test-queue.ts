/**
 * Test Redis + Bull Queue
 * Run: npm run dev:test-queue
 */

import { notificationQueue } from './modules/notifications/queue.js';
import { startNotificationWorker } from './modules/notifications/notifications.worker.js';

async function testQueue() {
  console.log('🧪 Testing Redis + Bull Queue...\n');

  // Start worker
  startNotificationWorker();

  // Test 1: Add a simple job
  console.log('📤 Adding test job to queue...');
  const job = await notificationQueue.add('send-notification', {
    eventType: 'TEST_NOTIFICATION',
    recipientIds: ['test-user-1', 'test-user-2'],
    title: 'Test Notification',
    message: 'This is a test notification to verify Redis + Bull queue',
    metadata: { test: true },
    emailSubject: 'Test Email Subject',
    emailHtml: '<h1>Test Email</h1><p>Queue is working!</p>'
  });

  console.log(`✅ Job added with ID: ${job.id}`);

  // Test 2: Check queue stats
  setTimeout(async () => {
    const waiting = await notificationQueue.getWaiting();
    const active = await notificationQueue.getActive();
    const completed = await notificationQueue.getCompleted();
    const failed = await notificationQueue.getFailed();

    console.log('\n📊 Queue Stats:');
    console.log(`- Waiting: ${waiting.length}`);
    console.log(`- Active: ${active.length}`);
    console.log(`- Completed: ${completed.length}`);
    console.log(`- Failed: ${failed.length}`);

    process.exit(0);
  }, 3000);
}

testQueue().catch(console.error);