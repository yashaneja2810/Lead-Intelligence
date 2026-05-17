import dotenv from 'dotenv';

dotenv.config();

export const config = {
  port: process.env.PORT || 5000,
  nodeEnv: process.env.NODE_ENV || 'development',
  frontendUrl: process.env.FRONTEND_URL || 'http://localhost:3000',
  
  ai: {
    geminiApiKey: process.env.GEMINI_API_KEY || '',
    groqApiKey: process.env.GROQ_API_KEY || '',
  },
  
  supabase: {
    url: process.env.SUPABASE_URL || '',
    anonKey: process.env.SUPABASE_ANON_KEY || '',
  },
  
  smtp: {
    host: process.env.SMTP_HOST || 'smtp.gmail.com',
    port: parseInt(process.env.SMTP_PORT || '587'),
    secure: process.env.SMTP_SECURE === 'true',
    user: process.env.SMTP_USER || '',
    password: process.env.SMTP_PASS || process.env.SMTP_PASSWORD || '',
    from: process.env.EMAIL_FROM || '',
    fromName: process.env.EMAIL_FROM_NAME || 'Lead Enrichment AI',
  },
  
  google: {
    enabled: process.env.ENABLE_GOOGLE_INTEGRATIONS === 'true',
    sheetsCredentials: process.env.GOOGLE_SHEETS_CREDENTIALS 
      ? JSON.parse(process.env.GOOGLE_SHEETS_CREDENTIALS) 
      : null,
    spreadsheetId: process.env.GOOGLE_SHEETS_SPREADSHEET_ID || '',
    driveFolderId: process.env.GOOGLE_DRIVE_FOLDER_ID || '',
  },
  
  rateLimit: {
    windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS || '900000'),
    maxRequests: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS || '10'),
  },
};

export default config;
