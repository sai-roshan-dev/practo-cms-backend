/**
 * Notification Queue Setup
 * 
 * Bull queue configuration for self-hosted Redis
 */

import Bull from 'bull';

// Redis connection - simple configuration for self-hosted Redis
const redisConnectionConfig = process.env.REDIS_URL || 'redis://localhost:6379';

// Create notification queue with self-hosted Redis
export const notificationQueue = new Bull('notifications', {
  redis: redisConnectionConfig,
  settings: {
    stalledInterval: 30 * 1000, // 30 seconds
    maxStalledCount: 1,
  },
  defaultJobOptions: {
    attempts: 3,
    backoff: {
      type: 'exponential',
      delay: 2000,
    },
    removeOnComplete: 100,
    removeOnFail: 500,
  },
});

// Queue event handlers (for monitoring)
notificationQueue.on('completed', (job) => {
  console.log(`✅ Notification job ${job.id} completed`);
});

notificationQueue.on('failed', (job, err) => {
  console.error(`❌ Notification job ${job.id} failed:`, err.message);
});

notificationQueue.on('stalled', (job) => {
  console.warn(`⚠️ Notification job ${job.id} stalled`);
});

export default notificationQueue;

