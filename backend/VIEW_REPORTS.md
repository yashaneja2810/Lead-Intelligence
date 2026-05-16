# 📄 Viewing Generated Reports

Since email delivery requires SMTP configuration, your generated PDF reports are saved locally.

---

## 📁 Report Location

All generated PDF reports are saved in:

```
f:\My Projects\Simplifi-IQ Assessment\backend\reports\
```

---

## 🔍 Finding Your Report

### Option 1: Open Folder in Explorer

```powershell
cd backend
explorer reports
```

This will open the reports folder in Windows Explorer.

### Option 2: List Reports

```powershell
cd backend
dir reports
```

### Option 3: Open Latest Report

```powershell
cd backend\reports
# Find the most recent PDF and open it
```

---

## 📊 Report Naming Convention

Reports are named:
```
REPORT_[timestamp]_[random]_[timestamp].pdf
```

Example:
```
REPORT_1778965920533_j85l88poq_1778965984772.pdf
```

The most recent file is your latest report!

---

## 🎯 What's in the Report?

Your PDF report includes:

1. **Cover Page** - Professional branded cover
2. **Executive Summary** - High-level overview
3. **Overall Scores** - 5 key metrics (0-100)
4. **Company Overview** - Business intelligence
5. **SEO Analysis** - Technical audit
6. **UX Analysis** - User experience evaluation
7. **AI Opportunities** - Personalized recommendations
8. **Quick Wins** - Immediate actions
9. **Technical Stack** - Technology analysis
10. **Strategic Recommendations** - Long-term roadmap

---

## ✅ Workflow Status

Even without email/Google services, the platform successfully:

- ✅ **Scrapes websites** - Deep multi-page analysis
- ✅ **AI Analysis** - 6 specialized agents
- ✅ **Generates PDF** - Professional consulting-style report
- ✅ **Saves locally** - Reports folder

---

## 📧 Optional: Configure Email

If you want email delivery, add to `backend\.env`:

```env
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=your_email@gmail.com
SMTP_PASSWORD=your_16_char_app_password
EMAIL_FROM=your_email@gmail.com
EMAIL_FROM_NAME=Lead Enrichment AI
```

**Get Gmail App Password:**
1. Go to Google Account → Security
2. Enable 2-Factor Authentication
3. Go to "App passwords"
4. Generate password for "Mail"
5. Copy the 16-character password

---

## 🚀 Quick Access

After generating a report, check the backend logs for the exact path:

```
2026-05-16T21:13:04.959Z [info]: PDF generated successfully 
{"pdfPath": "F:\\My Projects\\...\\reports\\REPORT_xxx.pdf"}
```

Copy that path and open it directly!

---

## 💡 Pro Tip

Keep the reports folder open while testing:

```powershell
cd backend
explorer reports
```

New reports will appear automatically as you generate them!

---

**Your reports are being generated successfully!** 🎉  
**Location:** `backend\reports\`  
**Format:** Professional PDF with comprehensive analysis
