import express from 'express';
import { uploadSingle, uploadMultiple } from '../middleware/upload.js';
import {
  uploadImage,
  uploadImages,
  deleteImage,
  getImages
} from '../controllers/uploadController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

// Public routes (for displaying images)
router.get('/', getImages);

// Protected routes (admin only)
router.post('/single', protect, uploadSingle, uploadImage);
router.post('/multiple', protect, uploadMultiple, uploadImages);
router.delete('/:filename', protect, deleteImage);

export default router;
