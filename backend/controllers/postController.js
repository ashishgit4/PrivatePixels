const Post = require('../models/Post');
const imagekit = require('../config/imagekit');

// GET /api/posts — fetch all posts newest first
const getAllPosts = async (req, res) => {
  try {
    const posts = await Post.find().sort({ createdAt: -1 });
    res.status(200).json({ success: true, data: posts });
  } catch (error) {
    console.error('Error fetching posts:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch posts' });
  }
};

// POST /api/posts — upload image and create post
const createPost = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: 'Image is required' });
    }

    const { caption = '' } = req.body;

    // Upload to ImageKit
    const uploadResponse = await imagekit.upload({
      file: req.file.buffer,
      fileName: `post_${Date.now()}_${req.file.originalname}`,
      folder: '/instaa/posts',
    });

    // Save to MongoDB
    const post = await Post.create({
      imageUrl: uploadResponse.url,
      imageFileId: uploadResponse.fileId,
      caption,
    });

    res.status(201).json({ success: true, data: post });
  } catch (error) {
    console.error('Error creating post:', error);
    res.status(500).json({ success: false, message: error.message || 'Failed to create post' });
  }
};

module.exports = { getAllPosts, createPost };
