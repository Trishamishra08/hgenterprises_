const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '.env') });

const http = require('http');
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const { Server } = require('socket.io');
const { setupCallSignaling } = require('./sockets/callSignaling');

const app = express();
const server = http.createServer(app);
const PORT = process.env.PORT || 5000;

// Middleware
const allowedOrigins = [
    'https://hgenterprises.vercel.app',
    'https://hgenterprisesnew.vercel.app',
    'https://hg-enterprises.vercel.app',
    'https://www.hgenterprises.vercel.app',
    'http://localhost:3000',
    'http://localhost:3001',
    'http://localhost:3002',
    'http://localhost:5173',
    process.env.FRONTEND_URL
].filter(Boolean);

const isAllowedOrigin = (origin) => {
    if (!origin) return true;
    if (allowedOrigins.includes(origin)) return true;
    // Vercel preview / production aliases
    try {
        const host = new URL(origin).hostname;
        if (host.endsWith('.vercel.app') && host.includes('hgenterprises')) return true;
        if (host.endsWith('.vercel.app') && host.includes('hg-enterprises')) return true;
    } catch (_) {
        return false;
    }
    return false;
};

app.use(cors({
    origin: function (origin, callback) {
        if (isAllowedOrigin(origin)) return callback(null, true);
        console.warn(`[CORS] Blocked origin: ${origin}`);
        return callback(null, false);
    },
    credentials: true
}));
app.use(express.json());

// Database Connection
mongoose.connect(process.env.MONGODB_URI)
    .then(() => console.log('Connected to MongoDB'))
    .catch((err) => console.error('MongoDB connection error:', err));

// Basic Route
app.get('/', (req, res) => {
    res.send('HG Enterprises API is running');
});

// Import Routes
const productRoutes = require('./routes/productRoutes');
const authRoutes = require('./routes/authRoutes');
const orderRoutes = require('./routes/orderRoutes');
const couponRoutes = require('./routes/couponRoutes');
const categoryRoutes = require('./routes/categoryRoutes');
const bannerRoutes = require('./routes/bannerRoutes');
const ticketRoutes = require('./routes/ticketRoutes');
const paymentRoutes = require('./routes/paymentRoutes');
const settingsRoutes = require('./routes/settingsRoutes');
const pageRoutes = require('./routes/pageRoutes');
const returnRoutes = require('./routes/returnRoutes');
const faqRoutes = require('./routes/faqRoutes');
const blogRoutes = require('./routes/blogRoutes');
const uploadRoutes = require('./routes/uploadRoutes');
const inventoryReportRoutes = require('./routes/inventoryReportRoutes');
const suggestionRoutes = require('./routes/suggestionRoutes');
const subscriptionRoutes = require('./routes/subscriptionRoutes');


const offerRoutes = require('./routes/offerRoutes');

// Use Routes
app.use('/api/products', productRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/coupons', couponRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/subcategories', categoryRoutes);
app.use('/api/banners', bannerRoutes);
app.use('/api/offers', offerRoutes);
app.use('/api/support', ticketRoutes);
app.use('/api/payments', paymentRoutes);
app.use('/api/settings', settingsRoutes);
app.use('/api/pages', pageRoutes);
app.use('/api/returns', returnRoutes);
app.use('/api/faqs', faqRoutes);
app.use('/api/blogs', blogRoutes);
app.use('/api/upload', uploadRoutes);
app.use('/api/inventory-reports', inventoryReportRoutes);
app.use('/api/suggestions', suggestionRoutes);
app.use('/api/subscriptions', subscriptionRoutes);





// Error Handling Middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ message: 'Internal Server Error', error: err.message });
});

const io = new Server(server, {
    cors: {
        origin: (origin, callback) => {
            if (isAllowedOrigin(origin)) return callback(null, true);
            console.warn(`[CORS/Socket] Blocked origin: ${origin}`);
            return callback(null, false);
        },
        credentials: true,
    },
});

setupCallSignaling(io);

server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
