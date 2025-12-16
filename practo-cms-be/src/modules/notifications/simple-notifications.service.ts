/**
 * Simple Notification Service (No Redis Required)
 * 
 * For Render free tier - processes notifications synchronously
 * Can be easily switched to queue-based when Redis is available
 */

import prisma from '../../prisma/client.js';
import { NotificationType } from '../../generated/prisma/index.js';
import { sendEmail } from './email.service.js';
import type { NotificationEventPayload } from './notifications.service.js';
import { NotificationService } from './notifications.service.js';

/**
 * Process notification immediately (no queue)
 * Use this for Render free tier
 */
export async function processNotificationSync(payload: NotificationEventPayload): Promise<void> {
  try {
    console.log(`📬 Processing notification: ${payload.eventType}`);

    // Build notification job data (reuse existing logic)
    const jobData = await (NotificationService as any).buildNotificationJob(payload);
    
    if (!jobData) {
      console.warn(`⚠️ No notification created for event: ${payload.eventType}`);
      return;
    }

    // Create in-app notifications
    const notificationPromises = jobData.recipientIds.map((userId: string) =>
      prisma.notification.create({
        data: {
          userId,
          type: NotificationType.IN_APP,
          title: jobData.title,
          message: jobData.message,
          metadata: jobData.metadata || {},
        },
      })
    );

    await Promise.all(notificationPromises);
    console.log(`✅ Created ${jobData.recipientIds.length} in-app notifications`);

    // Send/log emails if available
    if (jobData.emailSubject && jobData.emailHtml) {
      const users = await prisma.user.findMany({
        where: { id: { in: jobData.recipientIds } },
        select: { email: true },
      });

      const emailPromises = users
        .filter((user) => user.email)
        .map((user) =>
          sendEmail({
            to: user.email!,
            subject: jobData.emailSubject!,
            html: jobData.emailHtml!,
          })
        );

      await Promise.all(emailPromises);
      console.log(`📧 Processed ${emailPromises.length} email notifications`);
    }

  } catch (error: any) {
    console.error(`❌ Error processing notification:`, error);
    // Don't throw - notifications shouldn't break workflow
  }
}