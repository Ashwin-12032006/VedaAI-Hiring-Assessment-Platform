import { Queue, Worker, Job } from 'bullmq';
import Redis from 'ioredis';
import { AssignmentDB } from '../models/Assignment';
import { AIService } from '../services/ai';

export interface IJobPayload {
  assignmentId: string;
}

// Global WebSocket Broadcast Reference
let wssBroadcast: ((assignmentId: string, event: string, payload: any) => void) | null = null;

export const setWebSocketBroadcast = (broadcastFn: (assignmentId: string, event: string, payload: any) => void) => {
  wssBroadcast = broadcastFn;
};

// Queue configuration and handlers
export class JobQueueManager {
  private static redisConnection: Redis | null = null;
  private static bullQueue: Queue | null = null;
  private static bullWorker: Worker | null = null;
  private static useBullMQ = false;

  // Local In-Memory Fallback Queue variables
  private static localQueue: Array<{ assignmentId: string }> = [];
  private static localProcessing = false;

  public static async initialize() {
    const redisUrl = process.env.REDIS_URL || 'redis://127.0.0.1:6379';

    try {
      console.log('[Queue] Attempting to connect to Redis...');
      const connection = new Redis(redisUrl, {
        maxRetriesPerRequest: null,
        connectTimeout: 2000,
        showFriendlyErrorStack: true
      });

      // Register error event listener to prevent process crashes
      connection.on('error', (err) => {
        console.warn('[Redis] Connection error:', err.message);
      });

      // Wait to see if it actually connects
      await new Promise<void>((resolve, reject) => {
        const timeout = setTimeout(() => {
          connection.disconnect();
          reject(new Error('Redis connection timeout'));
        }, 2500);

        connection.once('connect', () => {
          clearTimeout(timeout);
          resolve();
        });
      });

      this.redisConnection = connection;
      this.useBullMQ = true;
      console.log('[Queue] Redis connected successfully. Using BullMQ.');

      // Initialize BullMQ Queue
      this.bullQueue = new Queue('assessment-generation', {
        connection: this.redisConnection
      });

      // Initialize BullMQ Worker
      this.bullWorker = new Worker(
        'assessment-generation',
        async (job: Job<IJobPayload>) => {
          await this.processJob(job.data.assignmentId);
        },
        { connection: this.redisConnection }
      );

      this.bullWorker.on('completed', (job) => {
        console.log(`[Queue] BullMQ Job completed for assignment: ${job.data.assignmentId}`);
      });

      this.bullWorker.on('failed', (job, err) => {
        console.error(`[Queue] BullMQ Job failed for assignment: ${job?.data.assignmentId}`, err);
      });

    } catch (err) {
      this.useBullMQ = false;
      console.warn('[Queue] Redis is offline or not found. Falling back to In-Memory Queue.');
    }
  }

  public static async addJob(assignmentId: string): Promise<void> {
    // 1. Update assignment status to 'processing' (or 'pending' then transition)
    await AssignmentDB.update(assignmentId, { status: 'processing' });
    this.notifyStatus(assignmentId, 'processing');

    if (this.useBullMQ && this.bullQueue) {
      console.log(`[Queue] Adding job to BullMQ for assignment: ${assignmentId}`);
      await this.bullQueue.add(`gen-${assignmentId}`, { assignmentId });
    } else {
      console.log(`[Queue] Adding job to Local In-Memory Queue for assignment: ${assignmentId}`);
      this.localQueue.push({ assignmentId });
      this.triggerLocalQueue();
    }
  }

  private static triggerLocalQueue() {
    if (this.localProcessing) return;
    this.localProcessing = true;
    
    // Process in the background without blocking the request
    setImmediate(async () => {
      while (this.localQueue.length > 0) {
        const item = this.localQueue.shift();
        if (item) {
          try {
            console.log(`[Queue] Local Worker processing: ${item.assignmentId}`);
            await this.processJob(item.assignmentId);
          } catch (err) {
            console.error(`[Queue] Local Worker failed for: ${item.assignmentId}`, err);
          }
        }
      }
      this.localProcessing = false;
    });
  }

  // Core Processing Engine shared by both BullMQ and local fallback
  private static async processJob(assignmentId: string): Promise<void> {
    console.log(`[Queue] Worker processing assignment generation for ID: ${assignmentId}`);
    
    const assignment = await AssignmentDB.getById(assignmentId);
    if (!assignment) {
      console.error(`[Queue] Assignment not found for ID: ${assignmentId}`);
      return;
    }

    try {
      // Stream generating status
      await AssignmentDB.update(assignmentId, { status: 'processing' });
      this.notifyStatus(assignmentId, 'processing');

      // Call AI Service
      const sections = await AIService.generateQuestionPaper(
        assignment.title,
        assignment.numQuestions,
        assignment.totalMarks,
        assignment.questionTypes,
        assignment.instructions,
        assignment.fileContent // Pass actual fileContent here instead of fileAttached name
      );

      // Save generated questions to DB and mark status completed
      await AssignmentDB.update(assignmentId, {
        status: 'completed',
        sections
      });

      console.log(`[Queue] Generation completed successfully for assignment: ${assignmentId}`);
      this.notifyStatus(assignmentId, 'completed', { sections });

    } catch (err: any) {
      console.error(`[Queue] Error generating questions for assignment ${assignmentId}:`, err);
      const errMsg = err?.message || 'Unknown error occurred during question generation';
      await AssignmentDB.update(assignmentId, {
        status: 'failed',
        error: errMsg
      });
      this.notifyStatus(assignmentId, 'failed', { error: errMsg });
    }
  }

  private static notifyStatus(assignmentId: string, status: string, extra: any = {}) {
    if (wssBroadcast) {
      wssBroadcast(assignmentId, 'job_update', {
        assignmentId,
        status,
        ...extra
      });
    }
  }
}
