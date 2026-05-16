import { google } from 'googleapis';
import { config } from '../config';
import logger from '../utils/logger';
import { LeadFormData } from '../types';

export class GoogleSheetsService {
  private sheets: any;
  private auth: any;

  constructor() {
    this.initializeAuth();
  }

  private initializeAuth() {
    try {
      if (!config.google.enabled) {
        logger.info('Google Sheets integration disabled');
        return;
      }

      if (!config.google.sheetsCredentials) {
        logger.warn('Google Sheets credentials not configured');
        return;
      }

      this.auth = new google.auth.GoogleAuth({
        credentials: config.google.sheetsCredentials,
        scopes: ['https://www.googleapis.com/auth/spreadsheets'],
      });

      this.sheets = google.sheets({ version: 'v4', auth: this.auth });
      logger.info('Google Sheets service initialized');
    } catch (error) {
      logger.error('Failed to initialize Google Sheets', { error });
    }
  }

  async logLead(
    lead: LeadFormData,
    reportId: string,
    status: string,
    pdfUrl?: string
  ): Promise<void> {
    try {
      if (!this.sheets || !config.google.spreadsheetId) {
        logger.warn('Google Sheets not configured, skipping log');
        return;
      }

      const timestamp = new Date().toISOString();

      const values = [
        [
          timestamp,
          lead.name,
          lead.email,
          lead.companyName,
          lead.websiteUrl,
          lead.industry,
          lead.aiProvider,
          reportId,
          status,
          pdfUrl || 'N/A',
          lead.additionalNotes || '',
        ],
      ];

      await this.sheets.spreadsheets.values.append({
        spreadsheetId: config.google.spreadsheetId,
        range: 'Leads!A:K',
        valueInputOption: 'USER_ENTERED',
        resource: { values },
      });

      logger.info('Lead logged to Google Sheets', { reportId });
    } catch (error) {
      logger.error('Failed to log lead to Google Sheets', { error });
      // Don't throw - this is not critical
    }
  }

  async ensureHeaders(): Promise<void> {
    try {
      if (!this.sheets || !config.google.spreadsheetId) {
        return;
      }

      const headers = [
        [
          'Timestamp',
          'Name',
          'Email',
          'Company Name',
          'Website URL',
          'Industry',
          'AI Provider',
          'Report ID',
          'Status',
          'PDF URL',
          'Additional Notes',
        ],
      ];

      // Check if headers exist
      const response = await this.sheets.spreadsheets.values.get({
        spreadsheetId: config.google.spreadsheetId,
        range: 'Leads!A1:K1',
      });

      if (!response.data.values || response.data.values.length === 0) {
        // Add headers
        await this.sheets.spreadsheets.values.update({
          spreadsheetId: config.google.spreadsheetId,
          range: 'Leads!A1:K1',
          valueInputOption: 'USER_ENTERED',
          resource: { values: headers },
        });

        logger.info('Google Sheets headers created');
      }
    } catch (error) {
      logger.error('Failed to ensure Google Sheets headers', { error });
    }
  }
}

export default new GoogleSheetsService();
