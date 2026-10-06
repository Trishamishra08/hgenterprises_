const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const Otp = require('../models/Otp');
const sms = require('../utils/sms');

// User Registration
exports.signup = async (req, res) => {
    try {
        const { name, email, password, phone, gender } = req.body;

        if (!gender || !['Female', 'Male', 'Other'].includes(gender)) {
            return res.status(400).json({ message: 'Please select a valid gender option' });
        }

        // Check if user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) return res.status(400).json({ message: 'User already exists' });

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create user
        const user = await User.create({
            name,
            email: email.trim().toLowerCase(),
            password: hashedPassword,
            phone,
            gender,
            role: 'user'
        });

        // Generate token
        const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '7d' });

        res.status(201).json({
            token,
            user: { id: user._id, name: user.name, email: user.email, role: user.role, phone: user.phone, gender: user.gender }
        });
    } catch (error) {
        res.status(500).json({ message: 'Signup failed', error: error.message });
    }
};

// User Login
exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Find user
        const user = await User.findOne({ email });
        if (!user) return res.status(404).json({ message: 'User not found' });

        // Verify password
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(400).json({ message: 'Invalid credentials' });

        // Generate token
        const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '7d' });

        res.status(200).json({
            token,
            user: { id: user._id, name: user.name, email: user.email, role: user.role, phone: user.phone, gender: user.gender, addresses: user.addresses }
        });
    } catch (error) {
        res.status(500).json({ message: 'Login failed', error: error.message });
    }
};

// Get User Profile (Protected)
exports.getProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select('-password');
        if (!user) return res.status(404).json({ message: 'User not found' });
        res.status(200).json(user);
    } catch (error) {
        res.status(500).json({ message: 'Failed to fetch profile', error: error.message });
    }
};

// Update Address (Protected)
exports.addAddress = async (req, res) => {
    try {
        const user = await User.findById(req.user.id);
        if (!user) return res.status(404).json({ message: 'User not found' });

        const newAddress = { ...req.body, id: Date.now().toString() };
        if (newAddress.isDefault) {
            user.addresses.forEach(a => a.isDefault = false);
        }
        user.addresses.push(newAddress);
        await user.save();

        res.status(200).json({ message: 'Address added successfully', addresses: user.addresses });
    } catch (error) {
        res.status(500).json({ message: 'Failed to add address', error: error.message });
    }
};
// --- OTP AUTH (SMS via DLT gateway, see utils/sms.js) ---

const OTP_TTL_MS = 5 * 60 * 1000;
const OTP_RESEND_COOLDOWN_MS = 30 * 1000;
const OTP_MAX_ATTEMPTS = 5;

const hashOtp = (phone, otp) =>
    crypto.createHmac('sha256', process.env.JWT_SECRET).update(`${phone}:${otp}`).digest('hex');

// 1. Send OTP
exports.sendOTP = async (req, res) => {
    try {
        const phone = String(req.body?.phone || '').replace(/\D/g, '').slice(-10);
        if (!/^[6-9]\d{9}$/.test(phone)) {
            return res.status(400).json({ message: 'Please enter a valid 10-digit mobile number' });
        }

        const smsReady = sms.isConfigured();
        if (!smsReady && process.env.NODE_ENV === 'production') {
            console.error('[AUTH] SMS gateway is not configured (SMS_API_KEY / SMS_SENDER_ID / SMS_DLT_TEMPLATE_ID)');
            return res.status(503).json({ message: 'OTP service is temporarily unavailable. Please try again later.' });
        }

        const existing = await Otp.findOne({ phone });
        if (existing && Date.now() - existing.lastSentAt.getTime() < OTP_RESEND_COOLDOWN_MS) {
            const wait = Math.ceil((OTP_RESEND_COOLDOWN_MS - (Date.now() - existing.lastSentAt.getTime())) / 1000);
            return res.status(429).json({ message: `Please wait ${wait}s before requesting another OTP` });
        }

        const otp = String(crypto.randomInt(100000, 1000000));
        await Otp.findOneAndUpdate(
            { phone },
            { codeHash: hashOtp(phone, otp), attempts: 0, lastSentAt: new Date(), expiresAt: new Date(Date.now() + OTP_TTL_MS) },
            { upsert: true, new: true, setDefaultsOnInsert: true }
        );

        const user = await User.findOne({ phone });

        if (smsReady) {
            try {
                await sms.sendOtpSms(phone, otp);
            } catch (err) {
                await Otp.deleteOne({ phone });
                console.error('[AUTH] SMS send failed:', err.message);
                return res.status(500).json({ message: 'Could not send the OTP SMS. Please try again.' });
            }
            return res.status(200).json({ success: true, message: 'OTP sent successfully', exists: !!user });
        }

        // Local development only: no gateway configured, so show the code in the server log
        console.log(`[AUTH][DEV] SMS not configured. OTP for +91 ${phone}: ${otp}`);
        return res.status(200).json({ success: true, message: 'OTP generated (dev mode, see server log)', exists: !!user });
    } catch (error) {
        console.error('[AUTH] sendOTP error:', error);
        return res.status(500).json({ message: 'Failed to send OTP', error: error.message });
    }
};

// 2. Verify OTP & Login/Signup
exports.verifyOTP = async (req, res) => {
    try {
        const { otp, name, email, gender } = req.body;
        const phone = String(req.body?.phone || '').replace(/\D/g, '').slice(-10);

        const record = await Otp.findOne({ phone });
        if (!record || record.expiresAt < new Date()) {
            return res.status(400).json({ message: 'OTP expired. Please request a new one.' });
        }
        if (record.attempts >= OTP_MAX_ATTEMPTS) {
            await Otp.deleteOne({ phone });
            return res.status(429).json({ message: 'Too many wrong attempts. Please request a new OTP.' });
        }

        const given = Buffer.from(hashOtp(phone, String(otp || '')));
        const stored = Buffer.from(record.codeHash);
        if (given.length !== stored.length || !crypto.timingSafeEqual(given, stored)) {
            record.attempts += 1;
            await record.save();
            return res.status(400).json({ message: 'Invalid OTP code' });
        }
        await Otp.deleteOne({ phone }); // single use

        // Find User
        let user = await User.findOne({ phone });

        // If user not found and it's a login attempt (no name provided)
        if (!user && !name) {
            return res.status(404).json({ success: false, message: 'Account not found. Please register first.' });
        }

        // If user not found and it's a signup attempt
        if (!user && name) {
            if (!email?.trim()) {
                return res.status(400).json({ message: 'Email address is required' });
            }

            const allowedGenders = ['Female', 'Male', 'Other'];
            const resolvedGender = allowedGenders.includes(gender) ? gender : 'Other';

            const normalizedEmail = email.trim().toLowerCase();
            const existingEmail = await User.findOne({ email: normalizedEmail });
            if (existingEmail) {
                return res.status(400).json({ message: 'This email is already registered. Please login instead.' });
            }

            user = await User.create({
                phone,
                name: name.trim(),
                email: normalizedEmail,
                gender: resolvedGender,
                role: 'user',
                password: await bcrypt.hash(Math.random().toString(36), 10)
            });

            console.log(`[AUTH] New customer registered: ${user.name} | ${user.email} | +91 ${user.phone} | ${user.gender}`);
        }

        // Generate token
        const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '7d' });

        res.status(200).json({
            token,
            user: { id: user._id, name: user.name, email: user.email, role: user.role, phone: user.phone, gender: user.gender, addresses: user.addresses }
        });
    } catch (error) {
        res.status(500).json({ message: 'Verification failed', error: error.message });
    }
};

// Remove Address (Protected)
exports.removeAddress = async (req, res) => {
    try {
        const user = await User.findById(req.user.id);
        if (!user) return res.status(404).json({ message: 'User not found' });

        user.addresses = user.addresses.filter(a => a._id.toString() !== req.params.addressId);
        await user.save();

        res.status(200).json({ message: 'Address removed successfully', addresses: user.addresses });
    } catch (error) {
        res.status(500).json({ message: 'Failed to remove address', error: error.message });
    }
};

// Update Profile (Protected)
exports.updateProfile = async (req, res) => {
    try {
        const { name, email, phone, bankDetails, gender } = req.body;
        const updateData = { name, email, phone, bankDetails };
        if (gender && ['Female', 'Male', 'Other'].includes(gender)) {
            updateData.gender = gender;
        }
        const user = await User.findByIdAndUpdate(
            req.user.id,
            updateData,
            { new: true, runValidators: true }
        ).select('-password');

        if (!user) return res.status(404).json({ message: 'User not found' });

        res.status(200).json({ message: 'Profile updated successfully', user });
    } catch (error) {
        res.status(500).json({ message: 'Failed to update profile', error: error.message });
    }
};

// Change Password (Protected)
exports.changePassword = async (req, res) => {
    try {
        const { currentPassword, newPassword } = req.body;
        const user = await User.findById(req.user.id);
        if (!user) return res.status(404).json({ message: 'User not found' });

        // Check current password
        const isMatch = await bcrypt.compare(currentPassword, user.password);
        if (!isMatch) return res.status(400).json({ message: 'Passcode galat hai. Kripya sahi passcode daalein.' });

        // Hash new password
        user.password = await bcrypt.hash(newPassword, 10);
        await user.save();

        res.status(200).json({ message: 'Passcode successfully update ho gaya hai.' });
    } catch (error) {
        res.status(500).json({ message: 'Passcode update fail ho gaya.', error: error.message });
    }
};

// Toggle Wishlist (Protected)
exports.toggleWishlist = async (req, res) => {
    try {
        const { productId } = req.body;
        const user = await User.findById(req.user.id);
        if (!user) return res.status(404).json({ message: 'User not found' });

        const index = user.wishlist.indexOf(productId);
        if (index === -1) {
            user.wishlist.push(productId);
            await user.save();
            res.status(200).json({ message: 'Added to wishlist', wishlist: user.wishlist });
        } else {
            user.wishlist.splice(index, 1);
            await user.save();
            res.status(200).json({ message: 'Removed from wishlist', wishlist: user.wishlist });
        }
    } catch (error) {
        res.status(500).json({ message: 'Failed to update wishlist', error: error.message });
    }
};

// Notification Management (Protected)
exports.markNotificationRead = async (req, res) => {
    try {
        const user = await User.findById(req.user.id);
        if (!user) return res.status(404).json({ message: 'User not found' });

        const notification = user.notifications.id(req.params.id);
        if (notification) {
            notification.read = true;
            await user.save();
        }

        res.status(200).json({ message: 'Notification marked as read', notifications: user.notifications });
    } catch (error) {
        res.status(500).json({ message: 'Failed to update notification', error: error.message });
    }
};

// Get All Users (Admin)
exports.getAllUsers = async (req, res) => {
    try {
        const users = await User.find().select('-password');
        res.status(200).json(users);
    } catch (error) {
        res.status(500).json({ message: 'Failed to fetch users', error: error.message });
    }
};
// Block/Unblock User (Admin)
exports.toggleUserStatus = async (req, res) => {
    try {
        const { userId } = req.params;
        const user = await User.findById(userId);
        if (!user) return res.status(404).json({ message: 'User not found' });

        user.isBlocked = !user.isBlocked;
        await user.save();

        res.status(200).json({ message: `User ${user.isBlocked ? 'blocked' : 'unblocked'} successfully`, user });
    } catch (error) {
        res.status(500).json({ message: 'Failed to update user status', error: error.message });
    }
};
