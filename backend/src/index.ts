import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import * as http from 'http';
import { WebSocketServer, WebSocket } from 'ws';
import mongoose from 'mongoose';
import assignmentsRouter from './routes/assignments';
import toolkitRouter from './routes/toolkit';
import { AssignmentDB } from './models/Assignment';
import { JobQueueManager, setWebSocketBroadcast } from './queue/worker';

dotenv.config();

const app = express();
const server = http.createServer(app);
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json({ limit: '10mb' }));

// REST API Routes
app.use('/api/assignments', assignmentsRouter);
app.use('/api/toolkit', toolkitRouter);

// Health check
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'OK', timestamp: new Date().toISOString() });
});

// WebSocket Setup
const wss = new WebSocketServer({ server });

// Map to track active client connections and their registered assignment ids
const clients = new Map<WebSocket, Set<string>>();

wss.on('connection', (ws: WebSocket) => {
  console.log('[WS] Client connected');
  clients.set(ws, new Set());

  ws.on('message', (message: string) => {
    try {
      const data = JSON.parse(message);
      if (data.type === 'subscribe') {
        const assignmentId = data.assignmentId;
        if (assignmentId) {
          clients.get(ws)?.add(assignmentId);
          console.log(`[WS] Client subscribed to updates for assignment: ${assignmentId}`);
          
          // Send current status immediately upon subscription
          AssignmentDB.getById(assignmentId).then(assignment => {
            if (assignment) {
              ws.send(JSON.stringify({
                event: 'job_update',
                data: {
                  assignmentId,
                  status: assignment.status,
                  sections: assignment.sections,
                  error: assignment.error
                }
              }));
            }
          });
        }
      }
    } catch (err) {
      console.error('[WS] Error processing message:', err);
    }
  });

  ws.on('close', () => {
    clients.delete(ws);
    console.log('[WS] Client disconnected');
  });

  ws.on('error', (err) => {
    console.error('[WS] Connection error:', err);
  });
});

// Register WebSocket Broadcast inside Queue Worker
setWebSocketBroadcast((assignmentId: string, event: string, payload: any) => {
  console.log(`[WS] Broadcasting job status update for ${assignmentId}: status=${payload.status}`);
  
  const message = JSON.stringify({ event, data: payload });
  
  wss.clients.forEach((client) => {
    if (client.readyState === WebSocket.OPEN) {
      const subs = clients.get(client);
      // Broadcast to clients who subscribed to this assignment ID, or broadcast to all for broad updates
      if (subs && (subs.has(assignmentId) || subs.size === 0)) {
        client.send(message);
      }
    }
  });
});

// Initialize Database Connection
const initDatabase = async () => {
  const mongoUri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/vedaai';
  
  try {
    console.log('[DB] Connecting to MongoDB...');
    await mongoose.connect(mongoUri, {
      connectTimeoutMS: 2000,
      serverSelectionTimeoutMS: 2000
    });
    AssignmentDB.setMongoActive(true);
    console.log('[DB] Connected to MongoDB successfully.');
  } catch (err) {
    console.warn('[DB] MongoDB connection failed. Falling back to local database.json adapter.');
    AssignmentDB.setMongoActive(false);
  }
};

// Start Server & Queue Worker
const startServer = async () => {
  await initDatabase();
  await JobQueueManager.initialize();

  server.listen(PORT, () => {
    console.log(`===============================================`);
    console.log(`🚀 VedaAI backend is running on http://localhost:${PORT}`);
    console.log(`🔌 WebSockets server is listening on ws://localhost:${PORT}`);
    console.log(`===============================================`);
  });
};

startServer().catch(err => {
  console.error('Server failed to start:', err);
});

export default app;
