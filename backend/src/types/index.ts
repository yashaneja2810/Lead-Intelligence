export interface LeadFormData {
  name: string;
  email: string;
  companyName: string;
  websiteUrl: string;
  industry: string;
  additionalNotes?: string;
  aiProvider: 'gemini' | 'groq';
}

export interface ScrapedData {
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
  internalLinks: string[];
  hasChat: boolean;
  hasBlog: boolean;
  testimonials: string[];
  pricingContent: string[];
  techStack: string[];
  isMobileResponsive: boolean;
  scrapedPages: {
    url: string;
    content: string;
    type: string;
  }[];
}

export interface AIInsights {
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
  aiOpportunities: {
    title: string;
    description: string;
    impact: string;
    priority: 'high' | 'medium' | 'low';
  }[];
  quickWins: {
    title: string;
    description: string;
    effort: string;
    impact: string;
  }[];
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

export interface ReportData {
  lead: LeadFormData;
  scrapedData: ScrapedData;
  insights: AIInsights;
  generatedAt: string;
  reportId: string;
}

export interface WorkflowStatus {
  step: string;
  status: 'pending' | 'in-progress' | 'completed' | 'failed';
  message: string;
  timestamp: string;
}

export interface AIProvider {
  name: 'gemini' | 'groq';
  generateInsights(scrapedData: ScrapedData, lead: LeadFormData): Promise<AIInsights>;
}
