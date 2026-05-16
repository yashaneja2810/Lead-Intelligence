import { google } from 'googleapis';
import { config } from '../config';
import logger from '../utils/logger';
import fs from 'fs';

export class GoogleDriveService {
  private drive: any;
  private auth: any;

  constructor() {
    this.initializeAuth();
  }

  private initializeAuth() {
    try {
      if (!config.google.enabled) {
        logger.info('Google Drive integration disabled');
        return;
      }

      if (!config.google.sheetsCredentials) {
        logger.warn('Google Drive credentials not configured');
        return;
      }

      this.auth = new google.auth.GoogleAuth({
        credentials: config.google.sheetsCredentials,
        scopes: ['https://www.googleapis.com/auth/drive.file'],
      });

      this.drive = google.drive({ version: 'v3', auth: this.auth });
      logger.info('Google Drive service initialized');
    } catch (error) {
      logger.error('Failed to initialize Google Drive', { error });
    }
  }

  async uploadPDF(pdfPath: string, fileName: string): Promise<string | null> {
    try {
      if (!this.drive || !config.google.driveFolderId) {
        logger.warn('Google Drive not configured, skipping upload');
        return null;
      }

      const fileMetadata = {
        name: fileName,
        parents: [config.google.driveFolderId],
      };

      const media = {
        mimeType: 'application/pdf',
        body: fs.createReadStream(pdfPath),
      };

      const response = await this.drive.files.create({
        requestBody: fileMetadata,
        media: media,
        fields: 'id, webViewLink',
      });

      const fileId = response.data.id;
      const webViewLink = response.data.webViewLink;

      // Make file accessible
      await this.drive.permissions.create({
        fileId: fileId,
        requestBody: {
          role: 'reader',
          type: 'anyone',
        },
      });

      logger.info('PDF uploaded to Google Drive', { fileId, webViewLink });

      return webViewLink;
    } catch (error) {
      logger.error('Failed to upload PDF to Google Drive', { error });
      return null;
    }
  }
}

export default new GoogleDriveService();
