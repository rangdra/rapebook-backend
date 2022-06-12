import express from 'express';
import {
  createPost,
  getPosts,
  getPost,
  getMyPosts,
  deletePost,
  updatePost,
  likePost,
  getTopPosts,
} from '../controllers/postController.js';
import { verifyToken, verifyUser } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/', verifyToken, createPost);
router.get('/', getPosts);
router.get('/:id', getPost);
router.get('/find/my-posts', verifyUser, getMyPosts);
router.get('/find/top-posts', getTopPosts);

router.put('/:id', verifyUser, updatePost);
router.delete('/:id', verifyUser, deletePost);

router.put('/:id/like', verifyToken, likePost);

export default router;
