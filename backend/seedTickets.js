const mongoose = require('mongoose');
const Ticket = require('./models/Ticket');
require('dotenv').config();

const tickets = [
    {
        id: 'TKT-2024-001',
        subject: 'Refund not received for returned item',
        category: 'Payment & Refunds',
        orderId: '1735123456',
        message: 'I returned the "Polki Ruby Necklace" 5 days ago, and the app says return delivered, but I have not received the refund in my account yet.',
        userName: 'Priya Sharma',
        userEmail: 'priya.s@example.com',
        status: 'Open',
        date: '2024-10-26T10:30:00'
    },
    {
        id: 'TKT-2024-002',
        subject: 'Wrong size delivered',
        category: 'Order Issues',
        orderId: '1735987654',
        message: 'I ordered size 2.4 bangles but received 2.6. Please arrange for an exchange.',
        userName: 'Rahul Verma',
        userEmail: 'rahul.v@example.com',
        status: 'Open',
        date: '2024-10-25T15:45:00'
    },
    {
        id: 'TKT-2024-003',
        subject: 'General enquiry about bridal sets',
        category: 'General Enquiry',
        orderId: '',
        message: 'Do you provide customization for bridal sets? I want a specific color combination.',
        userName: 'Sneha Patel',
        userEmail: 'sneha.p@example.com',
        status: 'In Progress',
        date: '2024-10-24T11:20:00'
    },
    {
        id: 'TKT-2024-004',
        subject: 'Payment failed but money deducted',
        category: 'Payment Issue',
        orderId: '1735112233',
        message: 'My UPI transaction failed on the checkout page, but the amount was debited from my bank.',
        userName: 'Amit Kumar',
        userEmail: 'amit.k@example.com',
        status: 'Open',
        date: '2024-10-23T18:10:00'
    },
    {
        id: 'TKT-2024-005',
        subject: 'Change delivery address',
        category: 'Shipping',
        orderId: '1735445566',
        message: 'I accidentally put my old address. Please update it to the new one before shipping.',
        userName: 'Kavita Singh',
        userEmail: 'kavita.s@example.com',
        status: 'Closed',
        date: '2024-10-22T09:00:00'
    }
];

const seedTickets = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('Connected to MongoDB');

        await Ticket.deleteMany({});
        console.log('Cleared existing Tickets');

        await Ticket.insertMany(tickets);
        console.log('Seeded Tickets successfully');

        process.exit();
    } catch (error) {
        console.error('Error seeding Tickets:', error);
        process.exit(1);
    }
};

seedTickets();
