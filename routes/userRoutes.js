import express from 'express';
import {
  getAllUsers,
  getUser,
  createUser,
  updateUser,
  deleteUser,
  toggleUserStatus,
  changePassword
} from '../controllers/userController.js';
import { protect } from '../middleware/auth.js';
import { checkRole } from '../middleware/permissions.js';

const router = express.Router();

// All routes require authentication and admin or super-admin role
router.use(protect);
router.use(checkRole(['admin', 'super-admin']));

router.route('/')
  .get(getAllUsers)
  .post(createUser);

router.route('/:id')
  .get(getUser)
  .put(updateUser)
  .delete(deleteUser);

router.put('/:id/toggle', toggleUserStatus);
router.put('/:id/password', changePassword);

export default router;
