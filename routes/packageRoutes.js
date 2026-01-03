import express from 'express';
import {
  getPackages,
  getPackage,
  createPackage,
  updatePackage,
  deletePackage,
  reorderPackages
} from '../controllers/packageController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

router.route('/')
  .get(getPackages)
  .post(protect, createPackage);

router.put('/reorder', protect, reorderPackages);

router.route('/:id')
  .get(getPackage)
  .put(protect, updatePackage)
  .delete(protect, deletePackage);

export default router;
