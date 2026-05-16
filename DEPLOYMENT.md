# 🚀 Deployment Guide

> SimplifIQ Lead Enrichment Platform - Production Deployment Instructions

---

## Overview

This guide covers deploying the lead enrichment platform to production environments. The system is production-ready and can be deployed to various platforms including Railway, Render, Vercel (frontend), or self-hosted servers.

---

## Pre-Deployment Checklist

### Code

- [ ] All tests passing locally
- [ ] TypeScript compilation successful (`npm run build`)
- [ ] Environment variables configured
- [ ] No hardcoded secrets in code
- [ ] Git history clean (no sensitive data committed)

### Credentials

- [ ] Gmail account with 2FA enabled
- [ ] Gmail app password generated (not regular password)
- [ ] Groq API key obtained
- [ ] Gemini API key obtained
- [ ] (Optional) Google Service Account credentials prepared

### Infrastructure

- [ ] Domain registered
- [ ] SSL certificate ready
- [ ] Database planned (if using persistence)
- [ ] Email provider tested
- [ ] Rate limiting configured for expected load

---

## Frontend Deployment (Vercel)

### Recommended: Vercel (Next.js native platform)

```bash
# 1. Install Vercel CLI
npm install -g vercel

# 2. Navigate to frontend
cd frontend

# 3. Deploy
vercel --prod

# 4. Configure environment variables in Vercel dashboard
# - NEXT_PUBLIC_API_URL: https://your-api-domain.com
```

### Alternative: Self-Hosted

```bash
cd frontend

# Build for production
npm run build

# Start production server
NODE_ENV=production npm start

# Or use PM2 for process management
npm install -g pm2
pm2 start "npm start" --name "lead-frontend"
pm2 save
pm2 startup
```

---

## Backend Deployment

### Option 1: Railway (Recommended)

```bash
# Install Railway CLI
npm install -g @railway/cli

# Login
railway login

# Initialize project
railway init

# Set environment variables
railway variable set PORT 5000
railway variable set NODE_ENV production
railway variable set FRONTEND_URL https://yourdomain.com
railway variable set GROQ_API_KEY your_key
railway variable set GEMINI_API_KEY your_key
railway variable set SMTP_HOST smtp.gmail.com
railway variable set SMTP_PORT 587
railway variable set SMTP_SECURE false
railway variable set SMTP_USER your-email@gmail.com
railway variable set SMTP_PASS your_app_password
railway variable set EMAIL_FROM your-email@gmail.com
railway variable set EMAIL_FROM_NAME "Lead Enrichment AI"

# Deploy
railway up
```

### Option 2: Render

1. Connect GitHub repository to Render
2. Create new "Web Service"
3. Configure:
   - **Name**: lead-enrichment-backend
   - **Environment**: Node
   - **Build Command**: `cd backend && npm install && npm run build`
   - **Start Command**: `cd backend && npm start`
   - **Instance Type**: Standard
   
4. Add Environment Variables (in Render dashboard):
   - Copy all values from `.env` file

5. Deploy by pushing to GitHub

### Option 3: Self-Hosted (VPS/Server)

```bash
# 1. SSH into server
ssh user@your-server.com

# 2. Install Node.js 18+
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# 3. Install PM2 for process management
sudo npm install -g pm2

# 4. Clone repository
git clone your-repo.git
cd your-repo/backend

# 5. Install dependencies
npm install

# 6. Create .env file with production values
nano .env

# 7. Build
npm run build

# 8. Start with PM2
pm2 start "npm start" --name "lead-backend"
pm2 save
pm2 startup

# 9. Setup Nginx reverse proxy
sudo apt-get install nginx
sudo nano /etc/nginx/sites-available/default

# Add configuration:
server {
    listen 80;
    server_name your-domain.com;
    
    location / {
        proxy_pass http://localhost:5000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}

# 10. Restart Nginx
sudo systemctl restart nginx

# 11. Setup SSL with Let's Encrypt
sudo apt-get install certbot python3-certbot-nginx
sudo certbot --nginx -d your-domain.com
```

---

## Environment Configuration (Production)

### Create `.env` for production:

```env
# Server
PORT=5000
NODE_ENV=production
FRONTEND_URL=https://yourdomain.com

# AI Providers
GROQ_API_KEY=gsk_your_production_key
GEMINI_API_KEY=AIzaSy_your_production_key

# Email (Gmail)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=noreply@yourdomain.com
SMTP_PASS=your_16_char_app_password
EMAIL_FROM=noreply@yourdomain.com
EMAIL_FROM_NAME=Lead Enrichment Team

# Rate Limiting
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100  # Adjust based on expected traffic

# Google Integration (if using)
ENABLE_GOOGLE_INTEGRATIONS=false  # Set to true if configured
GOOGLE_SHEETS_CREDENTIALS={}
GOOGLE_SHEETS_SPREADSHEET_ID=your_id
GOOGLE_DRIVE_FOLDER_ID=your_id
```

---

## Monitoring & Maintenance

### Health Checks

Add health check endpoint to test deployment:

```bash
curl https://your-api.com/health

# Response:
# {"status":"ok","timestamp":"2026-05-17T10:00:00Z"}
```

### Logging

Monitor logs in real-time:

```bash
# If using PM2
pm2 logs lead-backend

# If using Render/Railway
# Check dashboard for logs

# If self-hosted with Nginx
tail -f /var/log/nginx/access.log
tail -f /var/log/nginx/error.log
```

### Scaling

If experiencing high traffic:

1. **Increase rate limits** in `.env`
2. **Use Redis** for distributed rate limiting
3. **Add database** (PostgreSQL) for lead persistence
4. **Use CDN** (Cloudflare) for static assets
5. **Load balance** across multiple backend instances

---

## SSL/HTTPS Setup

### Automatic (Let's Encrypt on Nginx)

```bash
sudo certbot --nginx -d your-domain.com
sudo certbot renew --dry-run  # Test auto-renewal
```

### Manual

1. Get certificate from Let's Encrypt
2. Configure in Nginx or load balancer
3. Set `SMTP_SECURE=true` and `SMTP_PORT=465` if needed

---

## Backup & Recovery

### Backend Backup

```bash
# Backup .env and any data
tar -czf backup-$(date +%s).tar.gz .env uploads/

# Store in secure location
scp backup-*.tar.gz secure-storage:/backups/
```

### Database Backup (if using persistence)

```bash
# PostgreSQL example
pg_dump your_database > backup-$(date +%s).sql
```

---

## Troubleshooting Deployments

### "Cannot find module"

```bash
# Ensure all dependencies installed
npm install
npm run build
npm start
```

### "Port already in use"

```bash
# Change port
export PORT=5001
npm start

# Or kill existing process
lsof -ti:5000 | xargs kill -9
```

### "Email not sending"

```bash
# Verify credentials
# 1. Check Gmail app password (not regular password)
# 2. Enable 2FA on Gmail
# 3. Test SMTP connection: telnet smtp.gmail.com 587
```

### "Out of memory"

```bash
# Increase Node memory
NODE_OPTIONS=--max_old_space_size=4096 npm start

# Or use PM2 with memory limit
pm2 start app.js -i max --max-memory-restart 1G
```

---

## Performance Optimization

### Frontend
- Enable GZIP compression
- Use CDN for static assets
- Optimize images
- Enable caching headers

### Backend
- Use Redis for caching
- Implement database connection pooling
- Add API rate limiting
- Use compression middleware

```typescript
// app.use(compression());  // Uncomment in production
```

### Monitoring
- Set up uptime monitoring (UptimeRobot, Pingdom)
- Alert on errors (Sentry, Loggly)
- Track performance (DataDog, New Relic)

---

## Post-Deployment

1. **Test end-to-end workflow**
   - Submit test lead
   - Verify scraping works
   - Check email delivery
   - Review PDF quality

2. **Monitor logs** for first 24 hours

3. **Set up automatic backups**

4. **Configure alerting** for errors

5. **Document** any customizations

---

## Rollback Procedure

If deployment fails:

```bash
# If using Git
git revert HEAD  # Revert last commit
git push

# If using PM2
pm2 restart lead-backend

# If using containers
docker rollback  # Or re-deploy previous tag
```

---

## Cost Estimates

### Monthly hosting costs (typical):

| Component | Option | Cost |
|-----------|--------|------|
| Frontend | Vercel | Free-$20 |
| Backend | Railway | $5-$20 |
| Database | Supabase | Free-$25 |
| Email | Gmail | Free (using your account) |
| AI | Groq + Gemini | Free tier, then pay-as-you-go |
| Domain | Namecheap | $8-$15 |
| **Total** | | **$13-$80/month** |

---

## Getting Help

- Check logs first: `pm2 logs` or dashboard
- Review troubleshooting section in main README
- Check environment variables are set correctly
- Verify all API keys are valid

