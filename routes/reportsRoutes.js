import express from 'express';
import {
  getPaymentsReport,
  getOverdueReport,
  getProfitReport,
  getClientsReport
} from '../controllers/reportsController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

// All routes require authentication
router.use(protect);

router.get('/payments', getPaymentsReport);
router.get('/overdue', getOverdueReport);
router.get('/profit', getProfitReport);
router.get('/clients', getClientsReport);

export default router;
