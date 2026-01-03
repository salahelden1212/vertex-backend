import express from 'express';
import { body } from 'express-validator';
import { login, getMe, updatePassword, updateDetails } from '../controllers/authController.js';
import { protect } from '../middleware/auth.js';
import { validate } from '../middleware/validator.js';

const router = express.Router();

// Validation rules
const loginValidation = [
  body('email').isEmail().withMessage('Please provide a valid email'),
  body('password').notEmpty().withMessage('Password is required')
];

const updatePasswordValidation = [
  body('currentPassword').notEmpty().withMessage('Current password is required'),
  body('newPassword').isLength({ min: 6 }).withMessage('New password must be at least 6 characters')
];

// Routes
router.post('/login', loginValidation, validate, login);
router.get('/me', protect, getMe);
router.put('/updatepassword', protect, updatePasswordValidation, validate, updatePassword);
router.put('/updatedetails', protect, updateDetails);

export default router;
