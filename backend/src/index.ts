import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import { Server } from 'http';
import { config } from './config';
import routes from './routes';
import { errorHandler } from './middleware/errorHandler';
import logger from './utils/logger';
import googleSheetsService from './services/google-sheets.service';

const app = express();

// Security middleware
app.use(helmet());

// CORS configuration
app.use(cors({
  origin: config.frontendUrl,
  credentials: true,
}));

// Rate limiting
const limiter = rateLimit({
  windowMs: config.rateLimit.windowMs,
  max: config.rateLimit.maxRequests,
  message: 'Too many requests from this IP, please try again later.',
});

app.use('/api/', limiter);

// Body parsing
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use(routes);

// Error handling
app.use(errorHandler);

// Initialize services
const initializeServices = async () => {
  try {
    if (!config.google.enabled) {
      logger.info('Google integrations are disabled (ENABLE_GOOGLE_INTEGRATIONS != true)');
      return;
    }

    // Ensure Google Sheets headers
    await googleSheetsService.ensureHeaders();
    logger.info('Services initialized successfully');
  } catch (error) {
    logger.warn('Some services failed to initialize', { error });
  }
};

// Start server
const PORT = config.port;

const server: Server = app.listen(PORT, async () => {
  logger.info(`🚀 Server running on port ${PORT}`);
  logger.info(`Environment: ${config.nodeEnv}`);
  logger.info(`Frontend URL: ${config.frontendUrl}`);
  
  await initializeServices();
});

server.on('error', (error: NodeJS.ErrnoException) => {
  if (error.code === 'EADDRINUSE') {
    logger.error(`Port ${PORT} is already in use. Stop the other process or set a different PORT.`);
    process.exit(1);
    return;
  }

  logger.error('Server failed to start', {
    error: {
      name: error.name,
      message: error.message,
      stack: error.stack,
      code: error.code,
    },
  });
  process.exit(1);
});

// Graceful shutdown
process.on('SIGTERM', () => {
  logger.info('SIGTERM received, shutting down gracefully');
  process.exit(0);
});

process.on('SIGINT', () => {
  logger.info('SIGINT received, shutting down gracefully');
  process.exit(0);
});

export default app;
