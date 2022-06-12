import express from 'express';
import {
  followUser,
  getUser,
  getUserLogin,
  getUsers,
  savePost,
  updateUser,
} from '../controllers/userController.js';
import { verifyToken } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/', getUsers);
router.get('/find/:username', getUser);
router.get('/userLogin', verifyToken, getUserLogin);
router.put('/', verifyToken, updateUser);
router.put('/:id/follow', verifyToken, followUser);
router.put('/:postId/save', verifyToken, savePost);

export default router;
