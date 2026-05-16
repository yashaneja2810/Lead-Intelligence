import { config } from '../config';
import logger from '../utils/logger';
import { LeadFormData } from '../types';
import nodemailer from 'nodemailer';

/**
 * EmailService
 * 
 * Handles all email delivery operations including:
 * - SMTP connection initialization and verification
 * - HTML email template generation with personalized content
 * - PDF report attachment handling
 * - Error logging and recovery
 * 
 * Uses Gmail SMTP by default. Requires app password (not regular password).
 * 
 * @example
 * const emailService = new EmailService();
 * await emailService.sendReport(leadData, '/path/to/report.pdf');
 */
export class EmailService {
  private transporter: any = null;
  private initialized = false;

  constructor() {
    // Don't initialize in constructor - do it lazily on first use
  }

  /**
   * Ensures email transport is initialized and verified
   * Lazy initialization to avoid startup failures if email is misconfigured
   */
  private async ensureInitialized() {
    if (this.initialized) return;

    try {
      logger.info('Initializing email service...');
      logger.info('SMTP Config', {
        host: config.smtp.host,
        port: config.smtp.port,
        user: config.smtp.user,
        hasPassword: !!config.smtp.password,
        from: config.smtp.from,
      });

      this.transporter = nodemailer.createTransport({
        host: config.smtp.host,
        port: config.smtp.port,
        secure: config.smtp.secure,
        auth: {
          user: config.smtp.user,
          pass: config.smtp.password,
        },
      });

      // Verify SMTP connection before marking as initialized
      await this.transporter.verify();
      this.initialized = true;
      logger.info('Email service initialized successfully');
    } catch (error) {
      logger.error('Failed to initialize email service', {
        error:
          error instanceof Error
            ? { name: error.name, message: error.message, stack: error.stack }
            : error,
      });
      throw error;
    }
  }

  /**
   * Generates professional HTML email template with personalized content
   * Includes company info, report summary, next steps, and professional footer
   * 
   * @param lead - Lead data with company and contact information
   * @returns HTML string for email body
   */
  private generateEmailHTML(lead: LeadFormData): string {
    return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <style>
    body {
      font-family: 'Segoe UI', Tahoma, Arial, sans-serif;
      line-height: 1.5;
      color: #1f2937;
      background: #f3f4f6;
      max-width: 600px;
      margin: 0 auto;
      padding: 18px;
    }
    .wrapper {
      background: #ffffff;
      border: 1px solid #d1d5db;
      border-radius: 8px;
      overflow: hidden;
    }
    .header {
      background: #f5f5f5;
      border-bottom: 2px solid #e0e0e0;
      padding: 28px 20px;
      text-align: center;
    }
    .header h1 {
      margin: 0 0 8px 0;
      font-size: 24px;
      font-weight: 700;
      color: #1a1a1a;
    }
    .header p {
      margin: 0;
      font-size: 14px;
      color: #666666;
    }
    .content {
      padding: 28px 20px;
    }
    .greeting {
      font-size: 14px;
      font-weight: 600;
      color: #1f2937;
      margin-bottom: 12px;
    }
    .message {
      font-size: 13px;
      color: #374151;
      line-height: 1.6;
      margin-bottom: 18px;
    }
    .message p {
      margin: 0 0 8px 0;
    }
    .message p:last-child {
      margin-bottom: 0;
    }
    .section {
      margin-bottom: 18px;
      padding: 12px;
      background: #f9f9f9;
      border-left: 4px solid #cccccc;
      border-radius: 4px;
    }
    .section h3 {
      margin: 0 0 8px 0;
      color: #111827;
      font-size: 14px;
      font-weight: 700;
    }
    .section ul {
      margin: 0;
      padding-left: 20px;
      color: #374151;
    }
    .section li {
      margin: 5px 0;
      font-size: 13px;
    }
    .footer {
      background: #f8f9fa;
      padding: 12px 20px;
      text-align: center;
      font-size: 12px;
      color: #4b5563;
      border-top: 1px solid #e5e7eb;
    }
    .footer strong {
      color: #111827;
    }
    .signature {
      margin-top: 14px;
      padding-top: 10px;
      border-top: 1px solid #e5e7eb;
    }
    .small-note {
      font-size: 12px;
      color: #6b7280;
      margin-top: 10px;
    }
    .steps {
      margin-top: 8px;
      padding-left: 20px;
      color: #374151;
    }
    .steps li {
      margin: 5px 0;
      font-size: 13px;
    }
    .kpi-row {
      display: flex;
      gap: 8px;
      margin-top: 10px;
    }
    .kpi {
      flex: 1;
      border: 1px solid #e5e7eb;
      background: #f9fafb;
      border-radius: 6px;
      padding: 8px;
      text-align: center;
    }
    .kpi-label {
      font-size: 10px;
      text-transform: uppercase;
      letter-spacing: 0.4px;
      color: #6b7280;
      margin-bottom: 3px;
      font-weight: 700;
    }
    .kpi-value {
      font-size: 12px;
      font-weight: 600;
      color: #111827;
    }
  </style>
</head>
<body>
  <div class="wrapper">
    <div class="header">
      <h1>Your Business Audit Report Is Ready</h1>
      <p>Structured findings and actionable recommendations for ${lead.companyName}</p>
    </div>

    <div class="content">
      <div class="greeting">Hello ${lead.name},</div>

      <div class="message">
        <p>Thank you for your submission. We have completed a comprehensive analysis of ${lead.companyName}'s website and prepared your detailed audit report.</p>
        <p>The PDF attached includes prioritized recommendations designed for ${lead.industry} industry standards, with immediate quick wins and medium-term strategic improvements.</p>
      </div>

      <div class="section">
        <h3>What's Included in Your Report</h3>
        <ul>
          <li>Executive summary with performance scoring across 6 dimensions</li>
          <li>SEO audit with technical recommendations</li>
          <li>User experience evaluation and improvements</li>
          <li>Industry-specific AI readiness assessment</li>
          <li>Priority-ranked opportunities for ${lead.industry} market</li>
          <li>Quick wins with effort vs. impact analysis</li>
          <li>Technical stack review and strategic recommendations</li>
        </ul>
      </div>

      <div class="kpi-row">
        <div class="kpi">
          <div class="kpi-label">Company</div>
          <div class="kpi-value">${lead.companyName}</div>
        </div>
        <div class="kpi">
          <div class="kpi-label">Industry</div>
          <div class="kpi-value">${lead.industry}</div>
        </div>
      </div>

      <div class="section">
        <h3>Recommended Next Steps</h3>
        <ol class="steps">
          <li><strong>Review:</strong> Open the PDF and review all sections carefully.</li>
          <li><strong>Prioritize:</strong> Select 2-3 quick wins for immediate implementation (high impact, low effort).</li>
          <li><strong>Plan:</strong> Schedule medium-priority initiatives for next 4-8 weeks.</li>
          <li><strong>Engage:</strong> Reply to this email if you'd like a walkthrough of specific recommendations.</li>
        </ol>
      </div>

      <div class="signature">
        <p>Best regards,</p>
        <p><strong>${config.smtp.fromName}</strong></p>
        <p class="small-note">Questions about the report? Reply directly to this email—we're here to help!</p>
      </div>
    </div>

    <div class="footer">
      <p><strong>Lead Enrichment Platform</strong></p>
      <p>Confidential report prepared for ${lead.companyName}</p>
    </div>
  </div>
</body>
</html>
    `;
  }

  /**
   * Sends personalized email report to lead
   * Includes PDF attachment with industry-specific subject
   * 
   * @param lead - Lead data for personalization
   * @param pdfPath - Path to generated PDF file
   * @throws Error if email delivery fails
   */
  async sendReport(lead: LeadFormData, pdfPath: string): Promise<void> {
    try {
      await this.ensureInitialized();
      
      logger.info('Sending email report', { email: lead.email, company: lead.companyName });

      // Create personalized subject with industry context
      const industryCapitalized = lead.industry.charAt(0).toUpperCase() + lead.industry.slice(1);
      const personalizedSubject = `${industryCapitalized} Audit Report: ${lead.companyName} Strategic Analysis`;

      const mailOptions = {
        from: `${config.smtp.fromName} <${config.smtp.from}>`,
        to: lead.email,
        subject: personalizedSubject,
        html: this.generateEmailHTML(lead),
        attachments: [
          {
            filename: `${lead.companyName.replace(/\s+/g, '_')}_Business_Audit.pdf`,
            path: pdfPath,
          },
        ],
      };

      await this.transporter.sendMail(mailOptions);

      logger.info('Email sent successfully', { email: lead.email, subject: personalizedSubject });
    } catch (error) {
      logger.error('Failed to send email', {
        email: lead.email,
        error: error instanceof Error
          ? { name: error.name, message: error.message, stack: error.stack }
          : error,
      });
      throw new Error('Email delivery failed');
    }
  }

  /**
   * Verifies SMTP connection is working
   * Called on service initialization to fail fast if email is misconfigured
   * 
   * @returns true if connection verified, false otherwise
   */
  async verifyConnection(): Promise<boolean> {
    try {
      await this.ensureInitialized();
      await this.transporter.verify();
      logger.info('SMTP connection verified');
      return true;
    } catch (error) {
      logger.error('SMTP connection failed', { error });
      return false;
    }
  }
}

export default new EmailService();
