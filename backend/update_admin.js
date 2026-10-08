const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('./models/User');
const Settings = require('./models/Settings');
require('dotenv').config();

const NEW_EMAIL = 'hgenterprises@gmail.com';
const NEW_PASSWORD = 'admin12345';
const OLD_EMAILS = [
    'admin@hgenterprises.com',
    'admin@hgjewels.com',
    'admin@hg.com',
    'hgenterprises@gmail.com',
];

const updateAdminCredentials = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('Connected to Database...');

        const hashedPassword = await bcrypt.hash(NEW_PASSWORD, 10);

        let admin = await User.findOne({
            $or: [
                { role: 'admin' },
                { email: { $in: OLD_EMAILS } },
            ],
        }).sort({ role: 1 });

        if (admin) {
            admin.email = NEW_EMAIL;
            admin.password = hashedPassword;
            admin.role = 'admin';
            if (!admin.name) admin.name = 'Super Admin';
            await admin.save();
            console.log(`[OK] Updated admin user -> ${NEW_EMAIL}`);
        } else {
            admin = await User.create({
                name: 'Super Admin',
                email: NEW_EMAIL,
                password: hashedPassword,
                phone: '1234567890',
                role: 'admin',
            });
            console.log(`[OK] Created admin user -> ${NEW_EMAIL}`);
        }

        // Keep site/settings contact email in sync for admin panel
        const settings = await Settings.findOne();
        if (settings) {
            settings.email = NEW_EMAIL;
            await settings.save();
            console.log(`[OK] Settings.email updated -> ${NEW_EMAIL}`);
        } else {
            await Settings.create({ email: NEW_EMAIL });
            console.log(`[OK] Settings created with email -> ${NEW_EMAIL}`);
        }

        console.log('Admin credentials ready:');
        console.log(`  Email: ${NEW_EMAIL}`);
        console.log(`  Password: ${NEW_PASSWORD}`);
        process.exit(0);
    } catch (error) {
        console.error('Failed to update admin credentials:', error);
        process.exit(1);
    }
};

updateAdminCredentials();
