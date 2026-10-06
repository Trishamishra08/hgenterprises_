const User = require('../models/User');

/** Add an in-app notification for a customer (shown in their Notifications page). Never throws. */
async function notifyUser(userId, { title, message, type = 'order', link = '' }) {
    try {
        const user = await User.findById(userId);
        if (!user) return;
        user.notifications.unshift({ title, message, type, link, read: false, createdAt: new Date() });
        if (user.notifications.length > 50) user.notifications = user.notifications.slice(0, 50);
        await user.save();
    } catch (err) {
        console.error('[NOTIFY] failed:', err.message);
    }
}

module.exports = { notifyUser };
