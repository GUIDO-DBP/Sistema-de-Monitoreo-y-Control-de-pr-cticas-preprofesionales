import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import path from 'path';
import fs from 'fs';
import { env } from './config/env';
import { connectDatabase } from './config/prisma';
import { errorMiddleware } from './middlewares/error.middleware';
import routes from './routes';

const app = express();

// Ensure upload directory exists
const uploadPath = path.resolve(env.UPLOAD_DIR);
if (!fs.existsSync(uploadPath)) {
  fs.mkdirSync(uploadPath, { recursive: true });
}

// Security & Logging Middlewares
app.use(helmet({ crossOriginResourcePolicy: false }));
app.use(
  cors({
    origin: '*',
    credentials: false,
  }),
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
if (env.isDevelopment()) {
  app.use(morgan('dev'));
}

// Static uploads serving
app.use('/uploads', express.static(uploadPath));

// Health check endpoint
app.get('/api/health', (_req, res) => {
  res.status(200).json({
    status: 'ok',
    service: 'SMCPP API',
  });
});

// API Routes
app.use('/api', routes);

// Central error handler
app.use(errorMiddleware);

// Start Server
async function startServer() {
  try {
    await connectDatabase();
    app.listen(env.PORT, '0.0.0.0', () => {
      console.log(`🚀 SMCPP Backend listening on port ${env.PORT}`);
    });
  } catch (err) {
    console.error('Failed to start server:', err);
    process.exit(1);
  }
}

startServer();

export default app;
