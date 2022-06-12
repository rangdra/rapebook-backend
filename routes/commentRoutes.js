import express from 'express';
import {
  createComment,
  deleteComment,
} from '../controllers/commentController.js';
import { verifyToken } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/:postId', verifyToken, createComment);
router.delete('/:commentId', verifyToken, deleteComment);

export default router;
