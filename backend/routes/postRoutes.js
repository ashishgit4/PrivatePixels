const express = require('express');
const router = express.Router();
const upload = require('../middleware/upload');
const { getAllPosts, createPost } = require('../controllers/postController');

// GET /api/posts
router.get('/', getAllPosts);

// POST /api/posts (with image upload)
router.post('/', upload.single('image'), createPost);

module.exports = router;
