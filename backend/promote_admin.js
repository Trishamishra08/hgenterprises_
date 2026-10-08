const mongoose = require('mongoose');
const User = require('./models/User');
require('dotenv').config();

const promoteToAdmin = async (email) => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('Connected to Database...');

        const user = await User.findOneAndUpdate(
            { email: email },
            { role: 'admin' },
            { new: true }
        );

        if (user) {
            console.log(`Success! User ${email} is now an ADMIN.`);
        } else {
            console.log(`User with email ${email} not found.`);
        }

        process.exit();
    } catch (error) {
        console.error('Error:', error);
        process.exit(1);
    }
};

// Replace with your login email
const targetEmail = process.argv[2] || 'hgenterprises@gmail.com';
promoteToAdmin(targetEmail);
