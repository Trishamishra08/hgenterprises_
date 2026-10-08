const mongoose = require('mongoose');
const Faq = require('./models/Faq');
require('dotenv').config();

const faqs = [
    {
        category: 'Orders',
        question: 'How can I track my order?',
        answer: 'You can track your order by visiting the "My Orders" section in your profile or by using the tracking link sent to your email.',
        status: 'Active',
        order: 1
    },
    {
        category: 'Returns',
        question: 'What is your return policy?',
        answer: 'We offer a 7-day easy return policy for most items. The product must be unused and in its original packaging.',
        status: 'Active',
        order: 2
    },
    {
        category: 'Payments',
        question: 'What payment methods do you accept?',
        answer: 'We accept all major credit/debit cards, UPI, Wallets, and Net Banking. Cash on Delivery is also available for selected locations.',
        status: 'Active',
        order: 3
    },
    {
        category: 'Shopping',
        question: 'Are your silver ornaments hallmarked?',
        answer: 'Yes, all our 925 Silver ornaments are hallmarked and come with an authenticity certificate.',
        status: 'Active',
        order: 4
    }
];

const seedFaqs = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('Connected to MongoDB');

        await Faq.deleteMany({});
        console.log('Cleared existing FAQs');

        await Faq.insertMany(faqs);
        console.log('Seeded FAQs successfully');

        process.exit();
    } catch (error) {
        console.error('Error seeding FAQs:', error);
        process.exit(1);
    }
};

seedFaqs();
