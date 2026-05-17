import Groq from 'groq-sdk';
import { AIInsights, ScrapedData, LeadFormData } from '../types';
import { config } from '../config';
import logger from '../utils/logger';
import {
  buildContextPrompt,
} from '../prompts/agents';

export class GroqProvider {
  private client: Groq;
  private model = 'llama-3.3-70b-versatile';

  constructor() {
    this.client = new Groq({
      apiKey: config.ai.groqApiKey,
    });
  }

  private async callAgent(prompt: string, context: string, retries = 3): Promise<string> {
    for (let i = 0; i < retries; i++) {
      try {
        const completion = await this.client.chat.completions.create({
          messages: [
            {
              role: 'system',
              content: prompt,
            },
            {
              role: 'user',
              content: `${context}\n\nProvide your analysis in valid JSON format only.`,
            },
          ],
          model: this.model,
          temperature: 0.7,
          max_tokens: 4000,
        });

        return completion.choices[0]?.message?.content || '{}';
      } catch (error) {
        logger.warn(`Groq API call failed (attempt ${i + 1}/${retries})`, { error });
        if (i === retries - 1) throw error;
        await new Promise(resolve => setTimeout(resolve, 1000 * (i + 1)));
      }
    }
    throw new Error('Failed to call Groq API after retries');
  }

  private parseJSONResponse(text: string): any {
    try {
      const cleaned = text.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
      return JSON.parse(cleaned);
    } catch (error) {
      logger.error('Failed to parse JSON response', { text, error });
      return {};
    }
  }

  async generateInsights(scrapedData: ScrapedData, lead: LeadFormData): Promise<AIInsights> {
    try {
      logger.info('Generating insights with Groq single-call pipeline');

      const context = buildContextPrompt(lead.companyName, lead.industry, scrapedData);

      // Single comprehensive prompt combining all agents
      const comprehensivePrompt = `You are a team of expert business consultants. Analyze the provided company data and generate a comprehensive business audit report.

Your analysis must include:

1. COMPANY RESEARCH (Business Research Agent)
2. BUSINESS ANALYSIS (Business Analyst)
3. SEO EVALUATION (SEO Expert)
4. UX ASSESSMENT (UX/UI Expert)
5. AI OPPORTUNITIES (AI Strategy Consultant)
6. EXECUTIVE REPORT (Report Composer)

CRITICAL: Respond with ONLY valid JSON in this EXACT format:
{
  "companySummary": "2-3 sentence comprehensive summary of the company",
  "businessType": "B2B/B2C/B2B2C/Marketplace/etc",
  "targetAudience": "Specific description of target customers",
  "productCategory": "Main product/service category",
  "businessMaturity": "Startup/Growth/Established/Enterprise",
  "revenueModel": "Subscription/Transaction/Freemium/etc",
  "strengths": ["strength 1", "strength 2", "strength 3", "strength 4", "strength 5"],
  "weaknesses": ["weakness 1", "weakness 2", "weakness 3", "weakness 4"],
  "seoScore": 65,
  "seoIssues": ["issue 1", "issue 2", "issue 3", "issue 4", "issue 5"],
  "seoRecommendations": ["rec 1", "rec 2", "rec 3", "rec 4", "rec 5"],
  "uxScore": 72,
  "uxStrengths": ["strength 1", "strength 2", "strength 3", "strength 4"],
  "uxWeaknesses": ["weakness 1", "weakness 2", "weakness 3", "weakness 4"],
  "uxRecommendations": ["rec 1", "rec 2", "rec 3", "rec 4", "rec 5"],
  "aiOpportunities": [
    {
      "title": "Opportunity Title",
      "description": "Detailed description",
      "impact": "High/Medium/Low",
      "priority": "high/medium/low"
    }
  ],
  "quickWins": [
    {
      "title": "Quick Win Title",
      "description": "Description",
      "effort": "Low/Medium/High",
      "impact": "High/Medium/Low"
    }
  ],
  "executiveSummary": "Compelling 3-4 sentence summary",
  "strategicRecommendations": ["rec 1", "rec 2", "rec 3", "rec 4", "rec 5"],
  "aiReadinessScore": 58,
  "automationPotentialScore": 67,
  "technicalMaturityScore": 71,
  "confidenceScore": 82,
  "confidenceReasoning": "Brief explanation",
  "tone": "startup/enterprise/creative"
}

SCORING GUIDELINES (be realistic and varied, NOT 50):
- Scores should range from 35-85 based on actual findings
- SEO Score: 35-85 (assess meta tags, content, structure)
- UX Score: 40-85 (assess navigation, design, usability)
- AI Readiness: 30-80 (assess current tech adoption)
- Automation Potential: 40-85 (assess process opportunities)
- Technical Maturity: 35-85 (assess tech stack sophistication)

Provide at least:
- 5 strengths, 4 weaknesses
- 5 SEO issues, 5 SEO recommendations
- 4 UX strengths, 4 UX weaknesses, 5 UX recommendations
- 5-7 AI opportunities (personalized to industry)
- 4-6 quick wins
- 5-7 strategic recommendations

Make everything specific to THIS company, not generic.`;

      logger.info('Calling Groq API with comprehensive prompt...');
      
      const response = await this.callAgent(comprehensivePrompt, context);
      const data = this.parseJSONResponse(response);

      // Synthesize final insights from single response
      const insights: AIInsights = {
        companySummary: data.companySummary || `${lead.companyName} is a ${lead.industry} company.`,
        industry: lead.industry,
        businessType: data.businessType || 'B2B',
        targetAudience: data.targetAudience || 'Not specified',
        productCategory: data.productCategory || 'Not specified',
        businessMaturity: data.businessMaturity || 'Growing',
        revenueModel: data.revenueModel || 'Not specified',
        
        strengths: data.strengths || [
          'Strong digital presence',
          'Clear value proposition',
          'Professional website design',
          'Good content structure',
          'Effective call-to-actions'
        ],
        weaknesses: data.weaknesses || [
          'Limited AI integration',
          'SEO optimization needed',
          'Mobile experience could improve',
          'Analytics implementation unclear'
        ],
        
        seoInsights: {
          score: data.seoScore || 60,
          issues: data.seoIssues || [
            'Meta descriptions need optimization',
            'Heading hierarchy could be improved',
            'Internal linking structure unclear',
            'Page load speed not optimized',
            'Mobile responsiveness needs work'
          ],
          recommendations: data.seoRecommendations || [
            'Optimize meta tags for target keywords',
            'Improve heading structure (H1-H6)',
            'Implement comprehensive internal linking',
            'Optimize images and assets',
            'Add schema markup for rich snippets'
          ],
        },
        
        uxAnalysis: {
          score: data.uxScore || 65,
          strengths: data.uxStrengths || [
            'Clean, modern design',
            'Clear navigation structure',
            'Effective use of whitespace',
            'Good visual hierarchy'
          ],
          weaknesses: data.uxWeaknesses || [
            'CTA placement could be optimized',
            'Mobile navigation needs improvement',
            'Form fields could be simplified',
            'Loading states not clear'
          ],
          recommendations: data.uxRecommendations || [
            'Optimize CTA button placement and design',
            'Improve mobile navigation experience',
            'Simplify form completion process',
            'Add loading indicators and feedback',
            'Enhance accessibility features'
          ],
        },
        
        aiOpportunities: data.aiOpportunities || [
          {
            title: 'AI-Powered Chatbot',
            description: 'Implement intelligent chatbot for 24/7 customer support and lead qualification',
            impact: 'High',
            priority: 'high'
          },
          {
            title: 'Personalization Engine',
            description: 'Use AI to personalize content and recommendations based on user behavior',
            impact: 'High',
            priority: 'high'
          },
          {
            title: 'Predictive Analytics',
            description: 'Implement predictive models for customer behavior and churn prevention',
            impact: 'Medium',
            priority: 'medium'
          },
          {
            title: 'Content Generation',
            description: 'Automate content creation for marketing and documentation',
            impact: 'Medium',
            priority: 'medium'
          },
          {
            title: 'Process Automation',
            description: 'Automate repetitive tasks and workflows with AI',
            impact: 'High',
            priority: 'high'
          }
        ],
        
        quickWins: data.quickWins || [
          {
            title: 'Optimize Meta Tags',
            description: 'Update title tags and meta descriptions for better SEO',
            effort: 'Low',
            impact: 'High'
          },
          {
            title: 'Add Live Chat',
            description: 'Implement chat widget for instant customer support',
            effort: 'Low',
            impact: 'High'
          },
          {
            title: 'Mobile Optimization',
            description: 'Fix mobile responsiveness issues',
            effort: 'Medium',
            impact: 'High'
          },
          {
            title: 'Add Analytics',
            description: 'Implement comprehensive analytics tracking',
            effort: 'Low',
            impact: 'Medium'
          }
        ],
        
        executiveSummary: data.executiveSummary || `${lead.companyName} demonstrates strong potential for growth through AI integration and digital optimization. Key opportunities include enhancing SEO performance, improving user experience, and implementing AI-powered automation to streamline operations and boost customer engagement.`,
        
        scores: {
          aiReadiness: data.aiReadinessScore || 55,
          seoHealth: data.seoScore || 60,
          uxQuality: data.uxScore || 65,
          automationPotential: data.automationPotentialScore || 70,
          technicalMaturity: data.technicalMaturityScore || 62,
        },
        
        strategicRecommendations: data.strategicRecommendations || [
          'Implement comprehensive SEO strategy focusing on technical optimization and content quality',
          'Develop AI-powered customer engagement tools to improve conversion rates',
          'Enhance mobile user experience with responsive design improvements',
          'Build data analytics infrastructure for informed decision-making',
          'Automate repetitive processes to improve operational efficiency'
        ],
        
        confidence: {
          overall: data.confidenceScore || 78,
          reasoning: data.confidenceReasoning || 'Analysis based on comprehensive website data and industry best practices',
        },
        
        tone: data.tone || 'startup',
      };

      logger.info('Groq insights generation completed (single call)');
      return insights;

    } catch (error) {
      logger.error('Failed to generate insights with Groq', { error });
      throw new Error('Failed to generate AI insights');
    }
  }
}

export default new GroqProvider();
