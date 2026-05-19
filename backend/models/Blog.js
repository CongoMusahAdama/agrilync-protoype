const mongoose = require('mongoose');

const blogSchema = new mongoose.Schema({
    title: { type: String, required: true, unique: true },
    slug: { type: String, required: true, unique: true },
    category: { type: String, required: true },
    author: { type: String, default: 'AgriLync Team' },
    readTime: { type: String, default: '5 min read' },
    excerpt: { type: String, required: true },
    content: { type: String, required: true },
    image: { type: String, default: '/lovable-uploads/blog1.png' },
    tags: [{ type: String }]
}, { timestamps: true });

module.exports = mongoose.models.Blog || mongoose.model('Blog', blogSchema);
