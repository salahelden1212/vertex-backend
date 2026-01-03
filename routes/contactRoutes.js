import express from 'express';
import {
  submitContactForm,
  getContactMessages,
  getContactMessage,
  updateMessageStatus,
  deleteContactMessage
} from '../controllers/contactController.js';
import { protect } from '../middleware/auth.js';
import { body } from 'express-validator';
import { validate } from '../middleware/validator.js';

const router = express.Router();

// Validation for contact form
const contactFormValidation = [
  body('name').notEmpty().trim().withMessage('Name is required'),
  body('email').isEmail().withMessage('Please provide a valid email'),
  body('phone').notEmpty().trim().withMessage('Phone is required'),
  body('message').notEmpty().trim().withMessage('Message is required')
];

// Public route
router.post('/', contactFormValidation, validate, submitContactForm);

// Protected routes
router.get('/', protect, getContactMessages);
router.get('/:id', protect, getContactMessage);
router.put('/:id', protect, updateMessageStatus);
router.delete('/:id', protect, deleteContactMessage);

export default router;
