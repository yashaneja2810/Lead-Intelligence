import puppeteer from 'puppeteer';
import { ReportData } from '../types';
import logger from '../utils/logger';
import path from 'path';
import fs from 'fs/promises';
import { generateReportHTML } from '../templates/report.template';

export class PDFService {
  private readonly outputDir = path.join(process.cwd(), 'reports');

  constructor() {
    this.ensureOutputDir();
  }

  private async ensureOutputDir() {
    try {
      await fs.mkdir(this.outputDir, { recursive: true });
    } catch (error) {
      logger.error('Failed to create reports directory', { error });
    }
  }

  async generatePDF(reportData: ReportData): Promise<string> {
    let browser = null;

    try {
      logger.info('Generating PDF report', { reportId: reportData.reportId });

      // Generate HTML content
      const htmlContent = generateReportHTML(reportData);

      // Launch browser
      browser = await puppeteer.launch({
        headless: 'new',
        args: ['--no-sandbox', '--disable-setuid-sandbox'],
      });

      const page = await browser.newPage();
      
      // Set content
      await page.setContent(htmlContent, {
        waitUntil: 'networkidle0',
      });

      // Generate PDF
      const pdfPath = path.join(
        this.outputDir,
        `${reportData.reportId}_${Date.now()}.pdf`
      );

      await page.pdf({
        path: pdfPath,
        format: 'A4',
        printBackground: true,
        margin: {
          top: '12px',
          right: '12px',
          bottom: '12px',
          left: '12px',
        },
      });

      logger.info('PDF generated successfully', { pdfPath });

      return pdfPath;

    } catch (error) {
      logger.error('Failed to generate PDF', { error });
      throw new Error('PDF generation failed');
    } finally {
      if (browser) {
        await browser.close();
      }
    }
  }

  async readPDFBuffer(pdfPath: string): Promise<Buffer> {
    try {
      return await fs.readFile(pdfPath);
    } catch (error) {
      logger.error('Failed to read PDF file', { pdfPath, error });
      throw error;
    }
  }
}

export default new PDFService();
