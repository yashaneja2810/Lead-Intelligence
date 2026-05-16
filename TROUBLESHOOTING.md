# 🔧 Troubleshooting Guide

> Common issues and solutions for SimplifIQ Lead Enrichment Platform

---

## Table of Contents

- [Installation Issues](#installation-issues)
- [Server Issues](#server-issues)
- [Email Issues](#email-issues)
- [Scraping Issues](#scraping-issues)
- [AI Provider Issues](#ai-provider-issues)
- [Google Integration Issues](#google-integration-issues)
- [Frontend Issues](#frontend-issues)
- [Performance Issues](#performance-issues)

---

## Installation Issues

### "Cannot find module 'xyz'"

**Problem**: TypeScript imports failing, missing dependencies

**Solutions**:
```bash
# Clear node_modules and reinstall
rm -r backend/node_modules
rm -r frontend/node_modules
npm install

# Also try rebuilding TypeScript
cd backend
npm run build

cd ../frontend
npm run build
```

### "Playwright install failed"

**Problem**: Playwright browser binaries not downloading

**Solution**:
```bash
cd backend
npx playwright install
npx playwright install-deps

# Or manual install for Windows
npx playwright install --with-deps
```

### "gyp ERR! on Windows"

**Problem**: Python or build tools missing

**Solution**:
```bash
# Install Python first
# Then: npm rebuild

npm install --global windows-build-tools
npm rebuild
```

---

## Server Issues

### "EADDRINUSE: address already in use :::5000"

**Problem**: Another process using port 5000

**Solution - Option 1 (Change port)**:
```bash
$env:PORT='5001'
npm run dev
```

**Solution - Option 2 (Kill process on Windows)**:
```bash
netstat -ano | findstr :5000
# Note the PID from output
taskkill /PID <PID> /F
npm run dev
```

**Solution - Option 3 (Kill process on Mac/Linux)**:
```bash
lsof -ti:5000 | xargs kill -9
npm run dev
```

### Server starts but crashes immediately

**Problem**: Invalid environment variables

**Checklist**:
- [ ] Copy `.env.example` to `.env`
- [ ] Fill in required API keys (GROQ_API_KEY or GEMINI_API_KEY)
- [ ] Check for typos in variable names
- [ ] Ensure JSON values are properly formatted

### "listen ECONNREFUSED"

**Problem**: Backend can't connect to database or external service

**Solutions**:
- Check internet connection
- Verify all environment variables set
- Check firewall isn't blocking connections
- Try running without Google integrations: `ENABLE_GOOGLE_INTEGRATIONS=false`

---

## Email Issues

### "Email not sending" or SMTP errors

**Problem**: Gmail SMTP authentication failed

**Checklist**:
- [ ] Is 2-Factor Authentication enabled on Gmail? (Required)
- [ ] Did you use **app password** (not regular password)?
  - Go to [myaccount.google.com/apppasswords](https://myaccount.google.com/apppasswords)
  - Select "Mail" and "Windows Computer" (or your OS)
  - Copy the 16-character password
- [ ] Is `SMTP_USER` set to your actual Gmail address?
- [ ] Check logs for exact error message

**Solution**:
```bash
# Update .env with correct values
SMTP_USER=your-email@gmail.com
SMTP_PASS=your16charapppassword  # NOT your regular password
SMTP_SECURE=false  # For port 587
SMTP_PORT=587
```

### "EAUTH: Invalid login"

**Problem**: Credentials incorrect or account not allowed

**Solutions**:
1. Verify app password in `.env` (copy exactly, spaces removed)
2. Re-generate app password from Gmail settings
3. Ensure 2FA is enabled on Gmail account
4. Try allowing "less secure apps" (if available in your account)

### "TimeoutError: Socket timeout"

**Problem**: Network connection slow or SMTP server unresponsive

**Solution**:
```bash
# Test SMTP connection manually
telnet smtp.gmail.com 587

# Or test with timeout increased:
# (Add timeout config to nodemailer if persists)
```

---

## Scraping Issues

### "Playwright timeout"

**Problem**: Website taking too long to load

**Expected behavior**: Falls back to Cheerio automatically

**To verify fallback working**:
```bash
# Check logs for:
# "Falling back to Cheerio"
# or "Cheerio extraction"

npm run dev  # Watch console
# Submit form with slow website
```

### "No content extracted"

**Problem**: Website structure unrecognizable

**Solutions**:
1. Check if website requires authentication (can't scrape behind login)
2. Try website directly in browser to verify it loads
3. Check logs for specific error

**To verify**:
```bash
# Test scraping manually
node -e "
const scraper = require('./dist/services/scraper.service.js');
scraper.default.scrapeWebsite('https://example.com')
  .then(data => console.log(JSON.stringify(data, null, 2)))
  .catch(err => console.error(err));
"
```

### "Chrome crash" or "Browser not found"

**Problem**: Puppeteer/Playwright can't find Chrome

**Solution**:
```bash
# Reinstall browsers
npx playwright install
npx puppeteer browsers install chrome
```

---

## AI Provider Issues

### "GROQ_API_KEY or GEMINI_API_KEY is not set"

**Problem**: Environment variables not configured

**Solution**:
1. Get free API keys:
   - Groq: [console.groq.com](https://console.groq.com)
   - Gemini: [makersuite.google.com](https://makersuite.google.com)

2. Add to `.env`:
```env
GROQ_API_KEY=gsk_your_key_here
GEMINI_API_KEY=AIzaSy_your_key_here
```

3. Restart server: `npm run dev`

### "API Error: 429 (Rate limited)"

**Problem**: Too many requests to AI API

**Solution**:
```bash
# Wait a bit and try again
# Or increase delay between requests

# Check rate limits:
# Groq free tier: ~30 requests/minute
# Gemini free tier: ~15 requests/minute

# If using in production, upgrade to paid tier
```

### "Invalid API key" or "401 Unauthorized"

**Problem**: API key invalid or expired

**Solutions**:
1. Verify key is correct (copy from provider dashboard)
2. Check key hasn't expired or been revoked
3. Generate new key if needed
4. Ensure no extra spaces: `GROQ_API_KEY=gsk_xyz` (not `gsk_xyz `)

### "API returned invalid JSON"

**Problem**: LLM response malformed

**Solution** (Usually auto-handled):
- Service retries automatically
- Check logs for LLM output
- Increase retry count if needed

---

## Google Integration Issues

### Google features not working

**Expected behavior**: Not working by default (disabled)

**To enable** (optional):
```env
ENABLE_GOOGLE_INTEGRATIONS=true
```

Then configure:
1. Create Google Cloud project
2. Enable Sheets + Drive APIs
3. Create Service Account
4. Download JSON credentials
5. Set in `.env`:
```env
GOOGLE_SHEETS_CREDENTIALS={...json...}
GOOGLE_SHEETS_SPREADSHEET_ID=your_id
GOOGLE_DRIVE_FOLDER_ID=your_id
```

### "403 Forbidden" or "Permission denied"

**Problem**: Service account doesn't have access

**Solution**:
1. Share spreadsheet with service account email
2. Verify folder ID is correct
3. Check service account has Editor permissions

### "Invalid JSON in GOOGLE_SHEETS_CREDENTIALS"

**Problem**: Credentials JSON malformed

**Solution**:
```bash
# Format should be single line:
GOOGLE_SHEETS_CREDENTIALS={"type":"service_account","project_id":"..."}

# Not multiline:
# ❌ GOOGLE_SHEETS_CREDENTIALS={
#      "type": "service_account",
#    }

# Use online JSON minifier if needed
```

---

## Frontend Issues

### "Cannot GET /"

**Problem**: Frontend not running or serving correctly

**Solutions**:
```bash
cd frontend

# Check if running
npm run dev

# Should output:
# ▲ Next.js 15.x
# - Local: http://localhost:3000
```

### "API calls failing" or "CORS error"

**Problem**: Frontend can't connect to backend

**Solutions**:
1. Verify backend running: `http://localhost:5000`
2. Check `FRONTEND_URL` in backend `.env` matches frontend URL
3. Verify no port mismatch

```env
# Backend .env should have:
FRONTEND_URL=http://localhost:3000  # (development)
FRONTEND_URL=https://yourdomain.com # (production)
```

### Build fails with "MODULE_NOT_FOUND"

**Problem**: Dependencies missing

**Solution**:
```bash
cd frontend
rm -r node_modules .next
npm install
npm run build
```

---

## Performance Issues

### "Workflow takes too long" (>2 minutes)

**Normal timing**:
- Scraping: 5-15 seconds
- AI analysis: 10-20 seconds (Groq) or 15-30 seconds (Gemini)
- PDF generation: 5-10 seconds
- Email: 2-5 seconds
- **Total**: 30-60 seconds typical

**If taking longer**:
1. Check AI provider (Groq faster than Gemini)
2. Check network speed
3. Check server resources
4. Try again (might be API slow)

### "Out of memory" or "heap size exceeded"

**Problem**: Too many simultaneous requests

**Solutions**:
```bash
# Increase Node memory
NODE_OPTIONS=--max_old_space_size=4096 npm start

# Or restart server regularly with PM2
pm2 start app.js --max-memory-restart 1G
```

### "PDF generation slow or hanging"

**Problem**: Chrome/Puppeteer memory leak

**Solutions**:
```bash
# Restart backend
npm run dev

# Or with PM2:
pm2 restart lead-backend

# Check memory:
ps aux | grep node
```

---

## General Debugging

### Enable verbose logging

**Solution**: Check logs for detailed info
```bash
# Backend logs:
npm run dev
# Watch console for DEBUG output

# Check specific service:
# Look for lines like:
# [INFO] Workflow status update
# [ERROR] Failed to send email
```

### Check all dependencies

```bash
# Backend
cd backend
npm ls
# Look for conflicts or missing modules

# Frontend
cd frontend
npm ls
```

### Verify all configuration

```bash
# Backend - verify .env
cat backend/.env | grep -v "^$"  # Show non-empty lines

# Check if secrets are in file:
grep -r "sk_live" .  # Check no real API keys
grep -r "AKIA" .     # Check no AWS keys
```

---

## When Everything Fails

### Nuclear option: Fresh start

```bash
# Stop everything
npm run dev  # Ctrl+C

# Clean everything
rm -rf backend/node_modules frontend/node_modules
rm -rf backend/dist frontend/.next
rm backend/.env  # (backup first!)

# Reinstall
npm install

# Reconfigure
cp backend/.env.example backend/.env
# ... edit .env with your values ...

# Start fresh
npm run dev
```

### Still stuck?

1. **Check console for exact error message**
2. **Google the error** (usually has solution)
3. **Check service documentation**:
   - Groq: [groq.com/docs](https://groq.com/docs)
   - Gemini: [ai.google.dev/docs](https://ai.google.dev/docs)
   - Playwright: [playwright.dev](https://playwright.dev)
   - Next.js: [nextjs.org/docs](https://nextjs.org/docs)

4. **Enable debug mode** in code and check output

---

## Quick Reference Checklist

**Before reporting issues**:
- [ ] Restarted server: `npm run dev`
- [ ] Verified `.env` file exists and has correct values
- [ ] Checked internet connection
- [ ] Cleared cache: `rm -rf node_modules`
- [ ] Read error message carefully (it usually says what's wrong)
- [ ] Checked logs for clues

**Most common issues**:
1. Missing/wrong `.env` variables
2. Port already in use (change PORT=5001)
3. Gmail app password wrong (use app password, not regular password)
4. API keys invalid or expired

