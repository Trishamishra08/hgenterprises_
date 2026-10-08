require('dotenv').config();
const mongoose = require('mongoose');

async function updateNavbar() {
    await mongoose.connect(process.env.MONGODB_URI);
    const db = mongoose.connection.db;

    const result = await db.collection('settings').updateOne({}, {
        $set: {
            navbarLinks: [
                { id: 1, name: 'GIFTS', path: '/shop?tag=gift' },
                { id: 2, name: 'GOLD COINS', path: '/shop?tag=coin' },
                { id: 3, name: 'ABOUT', path: '/about' },
                { id: 4, name: 'BLOG', path: '/blogs' },
                { id: 5, name: 'OFFERS', path: '/offers' },
                { id: 6, name: 'SHOP', path: '/shop' },
                { id: 7, name: 'CONTACT US', path: '/help' },
                { id: 8, name: 'TRACK ORDER', path: '/profile/orders' }
            ]
        }
    }, { upsert: true });

    console.log('Navbar links updated:', result.modifiedCount, 'document(s) modified or inserted via upsert');
    process.exit(0);
}

updateNavbar().catch(e => { console.error(e); process.exit(1); });
