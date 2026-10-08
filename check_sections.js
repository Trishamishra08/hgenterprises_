const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Settings = require('./models/Settings');

dotenv.config();

const check = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        const settings = await Settings.findOne();
        if (!settings) {
            console.log('No settings found');
        } else {
            console.log('Homepage Sections IDs:', Object.keys(settings.homepageSections || {}));
        }
        process.exit(0);
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
};

check();
