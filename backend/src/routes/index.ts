import { Router } from 'express';
import leadController from '../controllers/lead.controller';

const router = Router();

// Health check
router.get('/health', leadController.healthCheck);

// Lead submission (fire and forget)
router.post('/api/leads/submit', leadController.submitLead);

// Lead submission with real-time status (SSE)
router.post('/api/leads/submit-with-status', leadController.submitLeadWithStatus);

export default router;
