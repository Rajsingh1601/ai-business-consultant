import express, { Request, Response } from 'express';
import cors from 'cors';
import path from 'path';
import fs from 'fs';
import dotenv from 'dotenv';
import { conversationService } from './services/conversationService.js';
import { orchestrationService } from './services/orchestrationService.js';
import { storage } from './storage/storage.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Ensure reports directory exists
const reportsDir = path.join(process.cwd(), 'reports');
if (!fs.existsSync(reportsDir)) {
  fs.mkdirSync(reportsDir, { recursive: true });
}

// Health check
app.get('/api/health', (req: Request, res: Response) => {
  res.json({
    status: 'healthy',
    system: 'AI Multi-Agent Virtual Consulting Platform',
    managerAgent: 'Active',
    time: new Date().toISOString()
  });
});

// List conversations
app.get('/api/conversations', async (req: Request, res: Response) => {
  try {
    const q = req.query.q as string | undefined;
    const conversations = await conversationService.listConversations(q);
    res.json(conversations);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// Create new conversation
app.post('/api/conversations', async (req: Request, res: Response) => {
  try {
    const { title } = req.body;
    const conversation = await conversationService.createConversation(title);
    res.status(201).json(conversation);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// Get conversation by ID
app.get('/api/conversations/:id', async (req: Request, res: Response) => {
  try {
    const conversation = await conversationService.getConversation(req.params.id);
    if (!conversation) {
      return res.status(404).json({ error: 'Conversation not found' });
    }
    res.json(conversation);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// Rename conversation
app.patch('/api/conversations/:id', async (req: Request, res: Response) => {
  try {
    const { title } = req.body;
    if (!title || !title.trim()) {
      return res.status(400).json({ error: 'Title is required' });
    }
    const updated = await conversationService.renameConversation(req.params.id, title);
    if (!updated) {
      return res.status(404).json({ error: 'Conversation not found' });
    }
    res.json(updated);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// Delete conversation
app.delete('/api/conversations/:id', async (req: Request, res: Response) => {
  try {
    const deleted = await conversationService.deleteConversation(req.params.id);
    if (!deleted) {
      return res.status(404).json({ error: 'Conversation not found' });
    }
    res.json({ success: true, message: 'Conversation deleted' });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// Post a user message to conversation
app.post('/api/conversations/:id/messages', async (req: Request, res: Response) => {
  try {
    const { content } = req.body;
    if (!content || !content.trim()) {
      return res.status(400).json({ error: 'Message content cannot be empty' });
    }
    const result = await conversationService.processUserMessage(req.params.id, content);
    res.json(result);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// Start / Run consultation orchestration workflow
app.post('/api/consultations/:id/run', async (req: Request, res: Response) => {
  try {
    // Run asynchronously in the background so client can follow updates via polling or SSE
    orchestrationService.runConsultation(req.params.id).catch((err) => {
      console.error('[Consultation Run Error]', err);
    });

    const conv = await storage.getConversation(req.params.id);
    res.json({
      success: true,
      message: 'Consultation workflow initiated',
      dashboardState: conv?.dashboardState,
      conversationId: req.params.id
    });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// Retry a specific failed task
app.post('/api/consultations/:id/retry/:taskId', async (req: Request, res: Response) => {
  try {
    orchestrationService.retryFailedTask(req.params.id, req.params.taskId).catch((err) => {
      console.error('[Task Retry Error]', err);
    });

    res.json({
      success: true,
      message: `Retrying specialist task ${req.params.taskId}`
    });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// Get consultation status & dashboard state
app.get('/api/consultations/:id/status', async (req: Request, res: Response) => {
  try {
    const conv = await storage.getConversation(req.params.id);
    if (!conv) {
      return res.status(404).json({ error: 'Conversation not found' });
    }
    res.json({
      dashboardState: conv.dashboardState,
      plan: conv.consultationPlan,
      finalReport: conv.finalReport,
      businessContext: conv.businessContext
    });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// Server-Sent Events (SSE) for live consultation event stream
app.get('/api/consultations/:id/events', async (req: Request, res: Response) => {
  const conversationId = req.params.id;

  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('Connection', 'keep-alive');
  res.flushHeaders();

  const listener = (data: any) => {
    if (data.conversationId === conversationId) {
      res.write(`data: ${JSON.stringify(data)}\n\n`);
    }
  };

  orchestrationService.on('update', listener);

  req.on('close', () => {
    orchestrationService.off('update', listener);
  });
});

// Download generated PDF report
app.get('/api/consultations/:id/pdf', async (req: Request, res: Response) => {
  try {
    const conv = await storage.getConversation(req.params.id);
    if (!conv || !conv.finalReport?.pdfExport?.filePath) {
      return res.status(404).json({ error: 'PDF report has not been generated yet' });
    }

    const filePath = conv.finalReport.pdfExport.filePath;
    if (!fs.existsSync(filePath)) {
      return res.status(404).json({ error: 'PDF file not found on disk' });
    }

    const fileName = conv.finalReport.pdfExport.fileName || 'Business_Consulting_Report.pdf';
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename="${fileName}"`);

    const fileStream = fs.createReadStream(filePath);
    fileStream.pipe(res);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// Serve frontend static build in production if available
const frontendDist = path.join(process.cwd(), 'frontend', 'dist');
if (fs.existsSync(frontendDist)) {
  app.use(express.static(frontendDist));
  app.use((req: Request, res: Response, next) => {
    if (req.path.startsWith('/api')) {
      return next();
    }
    res.sendFile(path.join(frontendDist, 'index.html'));
  });
}

app.listen(PORT, () => {
  console.log(`[AI Consulting Server] Running on http://localhost:${PORT}`);
});
