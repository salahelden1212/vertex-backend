import express from 'express';
import {
  getMilestones,
  getMilestone,
  createMilestone,
  updateMilestone,
  deleteMilestone,
  toggleMilestone
} from '../controllers/milestoneController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

router.use(protect);

router.route('/')
  .get(getMilestones)
  .post(createMilestone);

router.route('/:id')
  .get(getMilestone)
  .put(updateMilestone)
  .delete(deleteMilestone);

router.put('/:id/toggle', toggleMilestone);

export default router;
