import { Request, Response } from 'express';
import { validateLeadForm } from '../utils/validation';
import workflowService from '../services/workflow.service';
import logger from '../utils/logger';

/**
 * LeadController
 * 
 * Handles all lead submission endpoints:
 * - POST /api/leads - Accept lead form submissions
 * 
 * Responsibilities:
 * - Validate incoming lead data with Joi
 * - Return 202 Accepted immediately (fire-and-forget)
 * - Stream workflow progress via SSE
 * - Handle errors gracefully
 * 
 * Architecture decision: Returns immediately (202) while processing in background.
 * This prevents request timeouts on slow workflows (scraping + AI can take 30-60s).
 * Uses Server-Sent Events (SSE) to stream real-time status updates to frontend.
 * 
 * @example
 * POST /api/leads
 * {
 *   "firstName": "John",
 *   "lastName": "Doe",
 *   "email": "john@example.com",
 *   "companyName": "Tech Corp",
 *   "companyWebsite": "https://example.com",
 *   "industry": "SaaS",
 *   "aiProvider": "groq"
 * }
 * 
 * Response: 202 Accepted
 * Connection: Upgrade to SSE for real-time status
 */
export class LeadController {
  /**
   * Submit lead for processing
   * 
   * Process:
   * 1. Validate lead form data against Joi schema
   * 2. If invalid: return 400 with error details
   * 3. If valid: 
   *    - Return 202 Accepted immediately
   *    - Start background workflow (scrape → AI → PDF → email)
   *    - Stream status updates via SSE
   * 
   * Error handling:
   * - Validation errors: 400 with error list
   * - Processing errors: logged, status stream shows error
   * - Network errors: SSE auto-reconnects
   * 
   * @param req - Express Request with form data in body
   * @param res - Express Response for SSE streaming
   */
  async submitLead(req: Request, res: Response): Promise<void> {
    try {
      // Validate request body using Joi schema
      // Checks: email format, URLs, required fields, etc.
      const { error, value } = validateLeadForm(req.body);

      if (error) {
        res.status(400).json({
          success: false,
          message: 'Validation failed',
          errors: error.details.map(detail => ({
            field: detail.path.join('.'),
            message: detail.message,
          })),
        });
        return;
      }

      logger.info('Lead submission received', { 
        email: value.email, 
        company: value.companyName 
      });

      // Execute workflow asynchronously (don't wait for completion)
      // This allows request to return immediately
      workflowService.executeWorkflow(value)
        .then(reportData => {
          logger.info('Workflow completed successfully', { 
            reportId: reportData.reportId 
          });
        })
        .catch(error => {
          logger.error('Workflow execution failed', { error });
        });

      // Return 202 Accepted immediately (processing in background)
      res.status(202).json({
        success: true,
        message: 'Lead submission received. Processing your request...',
        data: {
          companyName: value.companyName,
          email: value.email,
          aiProvider: value.aiProvider,
        },
      });

    } catch (error) {
      logger.error('Lead submission error', { error });
      res.status(500).json({
        success: false,
        message: 'Internal server error',
      });
    }
  }

  async submitLeadWithStatus(req: Request, res: Response): Promise<void> {
    try {
      const { error, value } = validateLeadForm(req.body);

      if (error) {
        res.status(400).json({
          success: false,
          message: 'Validation failed',
          errors: error.details.map(detail => ({
            field: detail.path.join('.'),
            message: detail.message,
          })),
        });
        return;
      }

      logger.info('Lead submission with status tracking', { 
        email: value.email, 
        company: value.companyName 
      });

      // Set up SSE headers
      res.setHeader('Content-Type', 'text/event-stream');
      res.setHeader('Cache-Control', 'no-cache');
      res.setHeader('Connection', 'keep-alive');
      res.flushHeaders?.();

      const workflowId = `workflow_${Date.now()}`;

      // Register status callback
      workflowService.registerStatusCallback(workflowId, (status) => {
        res.write(`data: ${JSON.stringify(status)}\n\n`);
      });

      // Execute workflow
      try {
        const reportData = await workflowService.executeWorkflow(value, workflowId);
        
        res.write(`data: ${JSON.stringify({
          step: 'completed',
          status: 'completed',
          message: 'Workflow completed successfully!',
          timestamp: new Date().toISOString(),
          reportId: reportData.reportId,
        })}\n\n`);

        res.end();
      } catch (error) {
        res.write(`data: ${JSON.stringify({
          step: 'error',
          status: 'failed',
          message: 'Workflow failed. Please try again.',
          timestamp: new Date().toISOString(),
        })}\n\n`);

        res.end();
      }

    } catch (error) {
      logger.error('Lead submission with status error', { error });
      res.status(500).json({
        success: false,
        message: 'Internal server error',
      });
    }
  }

  async healthCheck(req: Request, res: Response): Promise<void> {
    res.status(200).json({
      success: true,
      message: 'API is running',
      timestamp: new Date().toISOString(),
    });
  }
}

export default new LeadController();
