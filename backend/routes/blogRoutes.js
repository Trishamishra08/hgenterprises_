const express = require('express');
const router = express.Router();
const blogController = require('../controllers/blogController');

// Public routes
router.get('/', blogController.getAllBlogs);
router.get('/:id', blogController.getBlogById);

// Admin routes (should ideally have auth middleware)
router.post('/admin/create', blogController.createBlog);
router.put('/admin/:id', blogController.updateBlog);
router.delete('/admin/:id', blogController.deleteBlog);

module.exports = router;
