const express = require('express');
const router = express.Router();

const { getPosts, createPost, patchPost, deletePost, deletePostAll } = require('../controllers/posts');

router.get('/', getPosts);
router.post('/', createPost);
router.patch('/:id', patchPost);
router.delete('/:id', deletePost);
router.delete('/', deletePostAll);

module.exports = router;
