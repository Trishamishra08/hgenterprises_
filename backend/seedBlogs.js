const mongoose = require('mongoose');
const Blog = require('./models/Blog');
require('dotenv').config();

const blogs = [
    {
        title: 'The Art of Layering Silver Necklaces',
        category: 'Style Guide',
        image: 'https://images.unsplash.com/photo-1601121141461-9d6647bca1ed?auto=format&fit=crop&q=80&w=1200',
        excerpt: 'Discover how to create the perfect layered look with our guide to mixing and matching silver chains.',
        content: '<p>Discover how to create the perfect layered look with our guide to mixing and matching silver chains and pendants. The key is in varying lengths and textures...</p>',
        date: '2024-02-15',
        author: 'Admin'
    },
    {
        title: 'Caring for Your Sterling Silver',
        category: 'Care Tips',
        image: 'https://images.unsplash.com/photo-1611591437281-460bfbe1220a?auto=format&fit=crop&q=80&w=1200',
        excerpt: 'Learn the essential tips to keep your silver jewelry shining bright for years to come.',
        content: '<p>Silver requires special care to prevent tarnish. Store your jewelry in a cool, dry place and use a polishing cloth regularly...</p>',
        date: '2024-02-10',
        author: 'Admin'
    }
];

const seedBlogs = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('Connected to MongoDB');

        await Blog.deleteMany({});
        await Blog.insertMany(blogs);

        console.log('Finished seeding blogs');
        process.exit();
    } catch (error) {
        console.error('Error seeding blogs:', error);
        process.exit(1);
    }
};

seedBlogs();
