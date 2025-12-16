/**
 * Notification Queue Setup
 * 
 * Bull queue configuration for background notification processing
 */

import Bull from 'bull';
import Redis from 'ioredis';

// Redis connection configuration for Upstash
const redisConfig: any = {
  maxRetriesPerRequest: 20, // Increase retries for Upstash
  enableReadyCheck: false,
  connectTimeout: 60000, // 60 seconds for Upstash
  commandTimeout: 5000,
  retryDelayOnFailover: 100,
  lazyConnect: false, // Connect immediately
  // Upstash TLS configuration
  tls: {
    rejectUnauthorized: false,
    servername: 'relative-cub-24032.upstash.io'
  },
  family: 4, // IPv4 only
  keepAlive: 30000,
  db: 0,
};

// Parse Upstash Redis URL for better connection handling
let redisConnectionConfig;
if (process.env.REDIS_URL) {
  // Use REDIS_URL directly for Upstash
  redisConnectionConfig = process.env.REDIS_URL;
} else {
  // Fallback to individual config
  redisConnectionConfig = {
    ...redisConfig,
    host: process.env.REDIS_HOST || 'localhost',
    port: parseInt(process.env.REDIS_PORT || '6379'),
    password: process.env.REDIS_PASSWORD || undefined,
  };
}

// Create notification queue with Upstash-optimized settings
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

