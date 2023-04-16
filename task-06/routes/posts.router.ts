import express from 'express';

import handleErrorAsync from '../services/handleErrorAsync';
import posts from '../controllers/posts';

const router = express.Router();

router.get('/', handleErrorAsync(posts.getPosts));
router.post('/', handleErrorAsync(posts.createPost));
router.patch('/:id', handleErrorAsync(posts.patchPost));
router.delete('/:id', handleErrorAsync(posts.deletePost));
router.delete('/', handleErrorAsync(posts.deletePostAll));

export default router;
