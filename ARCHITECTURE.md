# 🏗️ System Architecture

Comprehensive architecture documentation for the AI Lead Enrichment Platform.

---

## 🎯 High-Level Overview

```
┌─────────────────────────────────────────────────────────────────┐
│                         USER INTERFACE                           │
│                    (Next.js 15 Frontend)                         │
│  • Landing page with hero & features                            │
│  • Lead submission form with AI provider toggle                 │
│  • Real-time workflow status via Server-Sent Events             │
└────────────────────────┬────────────────────────────────────────┘
                         │
                         │ HTTP/REST + SSE
                         │
┌────────────────────────▼────────────────────────────────────────┐
│                      API GATEWAY                                 │
│                  (Express.js Backend)                            │
│  • Request validation (Joi)                                     │
│  • Rate limiting                                                │
│  • CORS handling                                                │
│  • Error handling                                               │
└────────────────────────┬────────────────────────────────────────┘
                         │
                         │
┌────────────────────────▼────────────────────────────────────────┐
│                  WORKFLOW ORCHESTRATOR                           │
│  Coordinates entire lead enrichment pipeline                    │
│  • Status tracking & callbacks                                  │
│  • Error recovery & retries                                     │
│  • Async execution management                                   │
└─────────────┬───────────────────────────────────────────────────┘
              │
              ├─────────────────────────────────────────────────┐
              │                                                 │
┌─────────────▼──────────┐  ┌──────────────┐  ┌──────────────┐│
│   SCRAPING ENGINE      │  │  AI PIPELINE │  │ PDF ENGINE   ││
│                        │  │              │  │              ││
│ • Playwright (primary) │  │ Multi-Agent: │  │ • Puppeteer  ││
│ • Cheerio (fallback)   │  │  - Research  │  │ • HTML/CSS   ││
│ • Multi-page scraping  │  │  - Analyst   │  │ • Charts     ││
│ • Screenshot capture   │  │  - SEO       │  │ • Templates  ││
│ • Tech detection       │  │  - UX        │  │              ││
│ • Retry logic          │  │  - AI Cons.  │  │              ││
│                        │  │  - Composer  │  │              ││
└────────────────────────┘  └──────────────┘  └──────────────┘│
              │                     │                 │         │
              └─────────────────────┴─────────────────┘         │
                                    │                           │
              ┌─────────────────────┴───────────────────────────┘
              │
┌─────────────▼──────────────────────────────────────────────────┐
│                    INTEGRATION LAYER                            │
│                                                                 │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐        │
│  │    SMTP      │  │ Google Sheets│  │ Google Drive │        │
│  │ (Nodemailer) │  │   Logging    │  │   Storage    │        │
│  │              │  │              │  │              │        │
│  │ • Email      │  │ • Lead data  │  │ • PDF files  │        │
│  │ • Attachment │  │ • Timestamp  │  │ • Shareable  │        │
│  │ • HTML       │  │ • Tracking   │  │ • Organized  │        │
│  └──────────────┘  └──────────────┘  └──────────────┘        │
└─────────────────────────────────────────────────────────────────┘
```

---

## 🔄 Data Flow

### 1. Lead Submission Flow

```
User fills form
    ↓
Frontend validation
    ↓
POST /api/leads/submit-with-status
    ↓
Backend validation (Joi)
    ↓
Workflow orchestrator starts
    ↓
SSE stream established
    ↓
Status updates sent to frontend
```

### 2. Scraping Flow

```
Receive website URL
    ↓
Normalize URL (add https://)
    ↓
Launch Playwright browser
    ↓
Navigate to homepage
    ↓
Extract comprehensive data:
  • Meta tags
  • Headings
  • Content
  • CTAs
  • Navigation
  • Tech stack
    ↓
Capture screenshots
    ↓
Discover internal links
    ↓
Scrape additional pages:
  • /about
  • /services
  • /pricing
  • /blog
  • /contact
    ↓
Fallback to Cheerio if Playwright fails
    ↓
Clean & deduplicate data
    ↓
Return structured ScrapedData
```

### 3. AI Analysis Flow

```
Receive scraped data + lead info
    ↓
Build context prompt
    ↓
┌─────────────────────────────────┐
│   AGENT 1: Research Agent       │
│   Analyzes business model       │
└──────────────┬──────────────────┘
               ↓
┌──────────────▼──────────────────┐
│   AGENT 2: Business Analyst     │
│   Evaluates strengths/weaknesses│
└──────────────┬──────────────────┘
               ↓
┌──────────────▼──────────────────┐
│   AGENT 3: SEO Expert           │
│   Audits technical SEO          │
└──────────────┬──────────────────┘
               ↓
┌──────────────▼──────────────────┐
│   AGENT 4: UX Critic            │
│   Evaluates user experience     │
└──────────────┬──────────────────┘
               ↓
┌──────────────▼──────────────────┐
│   AGENT 5: AI Consultant        │
│   Identifies AI opportunities   │
└──────────────┬──────────────────┘
               ↓
┌──────────────▼──────────────────┐
│   AGENT 6: Report Composer      │
│   Synthesizes all insights      │
└──────────────┬──────────────────┘
               ↓
Structured AIInsights object
```

### 4. PDF Generation Flow

```
Receive report data
    ↓
Generate HTML from template
    ↓
Inject data:
  • Company info
  • Scores
  • Insights
  • Recommendations
    ↓
Launch Puppeteer
    ↓
Render HTML to PDF
    ↓
Apply styling:
  • Gradients
  • Charts
  • Professional layout
    ↓
Save to /reports directory
    ↓
Return file path
```

### 5. Integration Flow

```
PDF generated
    ↓
┌─────────────────────────────────┐
│  Upload to Google Drive         │
│  • Create file                  │
│  • Set permissions              │
│  • Get shareable link           │
└─────────────┬───────────────────┘
              ↓
┌─────────────▼───────────────────┐
│  Log to Google Sheets           │
│  • Append row                   │
│  • Include metadata             │
│  • Add Drive link               │
└─────────────┬───────────────────┘
              ↓
┌─────────────▼───────────────────┐
│  Send Email via SMTP            │
│  • Generate HTML email          │
│  • Attach PDF                   │
│  • Send to lead                 │
└─────────────────────────────────┘
```

---

## 🧩 Component Architecture

### Frontend Components

```
App
├── Layout
│   ├── Metadata
│   └── Global Styles
│
└── Page
    ├── Hero
    │   ├── Animated Background
    │   ├── Title & Subtitle
    │   └── Feature Highlights
    │
    ├── Features
    │   └── Feature Cards (8)
    │       ├── Icon
    │       ├── Title
    │       └── Description
    │
    ├── LeadForm
    │   ├── AI Provider Toggle
    │   ├── Form Fields
    │   ├── Validation
    │   ├── Workflow Status
    │   └── Success/Error States
    │
    └── Footer
```

### Backend Services

```
Application
├── Config
│   └── Environment variables
│
├── Middleware
│   ├── CORS
│   ├── Rate Limiting
│   ├── Helmet (Security)
│   └── Error Handler
│
├── Routes
│   ├── Health Check
│   ├── Submit Lead
│   └── Submit with Status (SSE)
│
├── Controllers
│   └── Lead Controller
│       ├── Validation
│       ├── Workflow Trigger
│       └── Response Handling
│
├── Services
│   ├── Scraper Service
│   ├── Workflow Service
│   ├── PDF Service
│   ├── Email Service
│   ├── Google Sheets Service
│   └── Google Drive Service
│
├── Providers
│   ├── Gemini Provider
│   └── Groq Provider
│
└── Utils
    ├── Logger
    ├── Validation
    └── Helpers
```

---

## 🔐 Security Architecture

### Frontend Security
- **Input Validation**: Client-side validation
- **XSS Prevention**: React's built-in escaping
- **HTTPS**: Enforced in production
- **Environment Variables**: API URL only

### Backend Security
- **Helmet.js**: Security headers
- **Rate Limiting**: 10 requests per 15 minutes
- **CORS**: Whitelist frontend URL
- **Input Validation**: Joi schemas
- **Error Handling**: No sensitive data in responses
- **Environment Variables**: All secrets in .env

### API Security
- **API Keys**: Stored in environment variables
- **Service Account**: Limited permissions
- **SMTP**: App-specific passwords
- **No Authentication**: Public endpoint (rate-limited)

---

## 📊 Data Models

### LeadFormData
```typescript
{
  name: string;
  email: string;
  companyName: string;
  websiteUrl: string;
  industry: string;
  additionalNotes?: string;
  aiProvider: 'gemini' | 'groq';
}
```

### ScrapedData
```typescript
{
  url: string;
  title: string;
  description: string;
  heroText: string;
  headings: string[];
  paragraphs: string[];
  ctaButtons: string[];
  navigation: string[];
  footer: string[];
  metaTags: Record<string, string>;
  ogTags: Record<string, string>;
  structuredData: any[];
  screenshots: {
    fullPage?: string;
    hero?: string;
  };
  internalLinks: string[];
  hasChat: boolean;
  hasBlog: boolean;
  testimonials: string[];
  pricingContent: string[];
  techStack: string[];
  isMobileResponsive: boolean;
  scrapedPages: Array<{
    url: string;
    content: string;
    type: string;
  }>;
}
```

### AIInsights
```typescript
{
  companySummary: string;
  industry: string;
  businessType: string;
  targetAudience: string;
  productCategory: string;
  businessMaturity: string;
  revenueModel: string;
  strengths: string[];
  weaknesses: string[];
  seoInsights: {
    score: number;
    issues: string[];
    recommendations: string[];
  };
  uxAnalysis: {
    score: number;
    strengths: string[];
    weaknesses: string[];
    recommendations: string[];
  };
  aiOpportunities: Array<{
    title: string;
    description: string;
    impact: string;
    priority: 'high' | 'medium' | 'low';
  }>;
  quickWins: Array<{
    title: string;
    description: string;
    effort: string;
    impact: string;
  }>;
  executiveSummary: string;
  scores: {
    aiReadiness: number;
    seoHealth: number;
    uxQuality: number;
    automationPotential: number;
    technicalMaturity: number;
  };
  strategicRecommendations: string[];
  confidence: {
    overall: number;
    reasoning: string;
  };
  tone: 'startup' | 'enterprise' | 'creative';
}
```

---

## 🚀 Deployment Architecture

### Development
```
localhost:3000 (Frontend)
    ↓
localhost:5000 (Backend)
    ↓
External APIs (Gemini, Groq, Google)
```

### Production
```
Vercel (Frontend)
    ↓ HTTPS
Railway/Render (Backend)
    ↓ HTTPS
External APIs
```

---

## 📈 Scalability Considerations

### Current Limitations
- Single server instance
- Synchronous workflow execution
- No caching layer
- No database (optional Supabase)

### Future Improvements
1. **Queue System**: Bull/Redis for async jobs
2. **Caching**: Redis for scraped data
3. **Database**: PostgreSQL for persistence
4. **Load Balancing**: Multiple backend instances
5. **CDN**: CloudFlare for static assets
6. **Monitoring**: Sentry, DataDog
7. **Rate Limiting**: Per-user quotas

---

## 🔄 Error Handling Strategy

### Scraping Errors
- Retry with exponential backoff
- Fallback to Cheerio
- Return partial data if available
- Log errors for debugging

### AI API Errors
- Retry up to 3 times
- Switch providers if available
- Return generic insights as fallback
- Notify user of degraded service

### Integration Errors
- Continue workflow if non-critical
- Log failures for manual review
- Notify user of partial success
- Provide fallback options

---

## 📝 Logging Strategy

### Log Levels
- **ERROR**: Critical failures
- **WARN**: Recoverable issues
- **INFO**: Important events
- **DEBUG**: Detailed information

### Log Destinations
- Console (development)
- Files (production)
- External service (future: DataDog)

### Logged Events
- API requests
- Workflow steps
- Errors and exceptions
- Performance metrics
- Integration calls

---

## 🎯 Performance Optimization

### Frontend
- Code splitting
- Image optimization
- Lazy loading
- Caching strategies
- Minification

### Backend
- Async/await everywhere
- Connection pooling
- Browser instance reuse
- Parallel processing
- Response streaming (SSE)

---

**This architecture is designed for production-quality performance, reliability, and scalability.**
