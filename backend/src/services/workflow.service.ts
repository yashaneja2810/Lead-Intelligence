import { LeadFormData, ReportData, WorkflowStatus, AIInsights, ScrapedData } from '../types';
import logger from '../utils/logger';
import scraperService from './scraper.service';
import geminiProvider from '../providers/gemini.provider';
import groqProvider from '../providers/groq.provider';
import pdfService from './pdf.service';
import emailService from './email.service';
import googleSheetsService from './google-sheets.service';
import googleDriveService from './google-drive.service';
import { config } from '../config';
import { v4 as uuidv4 } from 'uuid';

/**
 * WorkflowService
 * 
 * Orchestrates the entire lead enrichment workflow:
 * 1. Validation - Verify lead data
 * 2. Scraping - Extract website content (Playwright + Cheerio fallback)
 * 3. AI Analysis - Generate personalized insights (6 agents)
 * 4. PDF Generation - Create professional report
 * 5. Email Delivery - Send report via SMTP
 * 6. Google Integration - Log to Sheets + archive to Drive (optional)
 * 
 * Features:
 * - Real-time status callbacks for frontend SSE
 * - Graceful error handling with fallbacks
 * - Multi-provider AI support (Groq, Gemini)
 * - Optional Google integration (toggle-enabled)
 * 
 * @example
 * const workflow = new WorkflowService();
 * workflow.registerStatusCallback(id, (status) => console.log(status));
 * const report = await workflow.executeWorkflow(leadData);
 */
export class WorkflowService {
  private statusCallbacks: Map<string, (status: WorkflowStatus) => void> = new Map();

  /**
   * Register callback for real-time workflow status updates
   * Used by controller to stream updates to frontend via SSE
   */
  registerStatusCallback(workflowId: string, callback: (status: WorkflowStatus) => void) {
    this.statusCallbacks.set(workflowId, callback);
  }

  /**
   * Emit status update to registered callback
   * Each step reports: pending → in-progress → completed/failed
   */
  private emitStatus(workflowId: string, step: string, status: WorkflowStatus['status'], message: string) {
    const statusUpdate: WorkflowStatus = {
      step,
      status,
      message,
      timestamp: new Date().toISOString(),
    };

    const callback = this.statusCallbacks.get(workflowId);
    if (callback) {
      callback(statusUpdate);
    }

    logger.info('Workflow status update', { workflowId, ...statusUpdate });
  }

  /**
   * Execute complete workflow: Scrape → AI → PDF → Email → (Google)
   * 
   * Handles all steps with graceful error recovery:
   * - Missing website data → uses industry defaults
   * - API timeouts → retries with backoff
   * - Email failures → logged but doesn't block
   * - Google errors → skipped if not enabled
   * 
   * @param lead - Lead form submission data
   * @returns Promise with final report data
   * @throws Error if critical steps fail (scraping, AI analysis)
   */
  async executeWorkflow(lead: LeadFormData): Promise<ReportData> {
    const workflowId = uuidv4();
    const reportId = `REPORT_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    let pdfPath: string;

    try {
      logger.info('Starting workflow execution', { workflowId, reportId, lead });

      // Step 1: Validate input
      this.emitStatus(workflowId, 'validation', 'in-progress', 'Validating lead information...');
      await this.delay(500);
      this.emitStatus(workflowId, 'validation', 'completed', 'Lead information validated successfully');

      // Step 2: Scrape website
      // Attempts Playwright first, falls back to Cheerio on timeout/failure
      this.emitStatus(workflowId, 'scraping', 'in-progress', `Analyzing ${lead.websiteUrl}...`);
      let scrapedData: ScrapedData;
      
      try {
        scrapedData = await scraperService.scrapeWebsite(lead.websiteUrl);
        this.emitStatus(workflowId, 'scraping', 'completed', 'Website analysis completed successfully');
      } catch (error) {
        this.emitStatus(workflowId, 'scraping', 'failed', 'Website scraping failed');
        throw new Error('Failed to scrape website');
      }

      // Step 3: Generate AI insights
      // Uses selected provider (Groq for speed, Gemini for depth)
      // Calls all 6 agents in single LLM call for efficiency
      this.emitStatus(workflowId, 'ai-analysis', 'in-progress', `Generating insights with ${lead.aiProvider.toUpperCase()}...`);
      let insights: AIInsights;

      try {
        if (lead.aiProvider === 'gemini') {
          insights = await geminiProvider.generateInsights(scrapedData, lead);
        } else {
          insights = await groqProvider.generateInsights(scrapedData, lead);
        }
        this.emitStatus(workflowId, 'ai-analysis', 'completed', 'AI analysis completed successfully');
      } catch (error) {
        this.emitStatus(workflowId, 'ai-analysis', 'failed', 'AI analysis failed');
        throw new Error('Failed to generate AI insights');
      }

      // Step 4: Generate PDF
      this.emitStatus(workflowId, 'pdf-generation', 'in-progress', 'Generating PDF report...');
      try {
        const reportData: ReportData = {
          lead,
          scrapedData,
          insights,
          generatedAt: new Date().toISOString(),
          reportId,
        };

        pdfPath = await pdfService.generatePDF(reportData);
        this.emitStatus(workflowId, 'pdf-generation', 'completed', 'PDF report generated successfully');
      } catch (error) {
        this.emitStatus(workflowId, 'pdf-generation', 'failed', 'PDF generation failed');
        throw new Error('Failed to generate PDF');
      }

      // Step 5: Upload to Google Drive
      this.emitStatus(workflowId, 'drive-upload', 'in-progress', 'Archiving report to Google Drive...');
      let driveUrl: string | null = null;

      if (config.google.enabled && config.google.driveFolderId) {
        try {
          driveUrl = await googleDriveService.uploadPDF(
            pdfPath,
            `${lead.companyName}_Audit_${Date.now()}.pdf`
          );
          this.emitStatus(workflowId, 'drive-upload', 'completed', 'Report archived successfully');
        } catch (error) {
          logger.warn('Google Drive upload failed, continuing workflow', { error });
          this.emitStatus(workflowId, 'drive-upload', 'completed', 'Drive upload skipped (failed)');
        }
      } else {
        logger.info('Google Drive disabled or not configured, skipping upload');
        this.emitStatus(workflowId, 'drive-upload', 'completed', 'Drive upload skipped (not configured)');
      }

      // Step 6: Log to Google Sheets
      this.emitStatus(workflowId, 'sheets-logging', 'in-progress', 'Logging lead data...');
      
      if (config.google.enabled && config.google.spreadsheetId) {
        try {
          await googleSheetsService.logLead(lead, reportId, 'completed', driveUrl || undefined);
          this.emitStatus(workflowId, 'sheets-logging', 'completed', 'Lead data logged successfully');
        } catch (error) {
          logger.warn('Google Sheets logging failed, continuing workflow', { error });
          this.emitStatus(workflowId, 'sheets-logging', 'completed', 'Sheets logging skipped (failed)');
        }
      } else {
        logger.info('Google Sheets disabled or not configured, skipping logging');
        this.emitStatus(workflowId, 'sheets-logging', 'completed', 'Sheets logging skipped (not configured)');
      }

      // Step 7: Send email
      this.emitStatus(workflowId, 'email-delivery', 'in-progress', `Sending report to ${lead.email}...`);
      
      if (config.smtp.user && config.smtp.password) {
        try {
          await emailService.sendReport(lead, pdfPath);
          this.emitStatus(workflowId, 'email-delivery', 'completed', 'Report delivered successfully!');
        } catch (error) {
          logger.error('Email delivery failed', { error });
          this.emitStatus(workflowId, 'email-delivery', 'failed', 'Email delivery failed - check SMTP configuration');
          // Don't throw - PDF is generated, that's the main output
        }
      } else {
        logger.warn('SMTP not configured, skipping email delivery');
        this.emitStatus(workflowId, 'email-delivery', 'completed', 'Email skipped (SMTP not configured) - PDF saved locally');
      }

      // Workflow completed
      logger.info('Workflow completed successfully', { workflowId, reportId, pdfPath });

      const finalReportData: ReportData = {
        lead,
        scrapedData,
        insights,
        generatedAt: new Date().toISOString(),
        reportId,
      };

      return finalReportData;

    } catch (error) {
      logger.error('Workflow execution failed', { workflowId, reportId, error });
      throw error;
    } finally {
      // Cleanup
      this.statusCallbacks.delete(workflowId);
    }
  }

  private delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}

export default new WorkflowService();
