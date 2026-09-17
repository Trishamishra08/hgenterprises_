const VideoCallSlot = require('../models/VideoCallSlot');
const VideoCallBooking = require('../models/VideoCallBooking');
const User = require('../models/User');
const Product = require('../models/Product');

const MAX_VC_CART = 5;

function makeCallId() {
    return `call_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 8)}`;
}

async function notifyUser(userId, { title, message, link = '' }) {
    const user = await User.findById(userId);
    if (!user) return;
    user.notifications.unshift({
        title,
        message,
        type: 'video_call',
        link,
        read: false,
        createdAt: new Date(),
    });
    if (user.notifications.length > 50) {
        user.notifications = user.notifications.slice(0, 50);
    }
    await user.save();
}

async function notifyAllAdmins({ title, message, link = '' }) {
    const admins = await User.find({ role: 'admin', isBlocked: { $ne: true } });
    await Promise.all(
        admins.map(async (admin) => {
            admin.notifications.unshift({
                title,
                message,
                type: 'video_call',
                link,
                read: false,
                createdAt: new Date(),
            });
            if (admin.notifications.length > 50) {
                admin.notifications = admin.notifications.slice(0, 50);
            }
            await admin.save();
        })
    );
}

function productSnapshot(p) {
    const specs = Array.isArray(p.specifications) ? p.specifications : [];
    const metal = specs.find((s) => /metal/i.test(s.label))?.value || '';
    const stone = specs.find((s) => /stone|diamond/i.test(s.label))?.value || '';
    const cat = (p.category || '').toString().toLowerCase();
    let department = 'jewellery';
    if (['machine', 'machines', 'machinery'].some((k) => cat.includes(k))) department = 'machines';
    else if (['tool', 'tools'].some((k) => cat.includes(k))) department = 'tools';

    return {
        product: p._id,
        name: p.name,
        image: p.image || '',
        code: p._id?.toString?.().slice(-8) || '',
        metal,
        stone,
        department,
        category: p.category || '',
    };
}

// ── Slots (admin create / public list available) ─────────────────

exports.createSlot = async (req, res) => {
    try {
        const { date, startTime, endTime, capacity = 1, note = '' } = req.body;
        if (!date || !startTime || !endTime) {
            return res.status(400).json({ message: 'date, startTime and endTime are required' });
        }
        const slot = await VideoCallSlot.create({
            date,
            startTime,
            endTime,
            capacity: Number(capacity) || 1,
            note,
            createdBy: req.user.id,
        });
        res.status(201).json(slot);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.listSlotsAdmin = async (req, res) => {
    try {
        const slots = await VideoCallSlot.find().sort({ date: 1, startTime: 1 });
        res.json(slots);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.listAvailableSlots = async (req, res) => {
    try {
        const today = new Date().toISOString().slice(0, 10);
        const slots = await VideoCallSlot.find({
            isActive: true,
            date: { $gte: today },
            $expr: { $lt: ['$bookedCount', '$capacity'] },
        }).sort({ date: 1, startTime: 1 });
        res.json(slots);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.updateSlot = async (req, res) => {
    try {
        const slot = await VideoCallSlot.findByIdAndUpdate(
            req.params.id,
            { $set: req.body },
            { new: true }
        );
        if (!slot) return res.status(404).json({ message: 'Slot not found' });
        res.json(slot);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.deleteSlot = async (req, res) => {
    try {
        const slot = await VideoCallSlot.findByIdAndDelete(req.params.id);
        if (!slot) return res.status(404).json({ message: 'Slot not found' });
        res.json({ message: 'Slot deleted' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// ── VC Cart ──────────────────────────────────────────────────────

exports.getCart = async (req, res) => {
    try {
        const user = await User.findById(req.user.id).populate('videoCallCart');
        const items = (user.videoCallCart || []).map(productSnapshot);
        res.json({ items, count: items.length, max: MAX_VC_CART });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.addToCart = async (req, res) => {
    try {
        const { productId } = req.body;
        if (!productId) return res.status(400).json({ message: 'productId required' });

        const product = await Product.findById(productId);
        if (!product) return res.status(404).json({ message: 'Product not found' });

        const user = await User.findById(req.user.id);
        const cart = user.videoCallCart || [];
        const exists = cart.some((id) => id.toString() === productId);
        if (exists) {
            await user.populate('videoCallCart');
            return res.json({
                message: 'Already in video call cart',
                items: user.videoCallCart.map(productSnapshot),
                count: user.videoCallCart.length,
            });
        }
        if (cart.length >= MAX_VC_CART) {
            return res.status(400).json({ message: `You can add up to ${MAX_VC_CART} designs for a video call` });
        }

        user.videoCallCart.push(productId);
        await user.save();
        await user.populate('videoCallCart');
        res.json({
            message: 'Added to video call cart',
            items: user.videoCallCart.map(productSnapshot),
            count: user.videoCallCart.length,
            max: MAX_VC_CART,
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.removeFromCart = async (req, res) => {
    try {
        const { productId } = req.params;
        const user = await User.findById(req.user.id);
        user.videoCallCart = (user.videoCallCart || []).filter((id) => id.toString() !== productId);
        await user.save();
        await user.populate('videoCallCart');
        res.json({
            items: user.videoCallCart.map(productSnapshot),
            count: user.videoCallCart.length,
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// ── Bookings ─────────────────────────────────────────────────────

exports.createBooking = async (req, res) => {
    try {
        const {
            slotId,
            customSlot,
            note = '',
            contactName = '',
            contactEmail = '',
            department,
            productIds,
        } = req.body;

        if (!String(contactName).trim() || !String(contactEmail).trim()) {
            return res.status(400).json({ message: 'Full name and email are required' });
        }

        const user = await User.findById(req.user.id).populate('videoCallCart');
        let products = [];

        if (Array.isArray(productIds) && productIds.length) {
            const docs = await Product.find({ _id: { $in: productIds } });
            products = docs.map(productSnapshot);
        } else {
            const cart = user.videoCallCart || [];
            products = cart.map(productSnapshot);
            if (department) {
                const d = department.toLowerCase();
                products = products.filter((p) => {
                    const pd = (p.department || 'jewellery').toLowerCase();
                    if (d === 'jewellery') return pd === 'jewellery';
                    return pd === 'tools' || pd === 'machines';
                });
            }
        }

        if (!products.length) {
            return res.status(400).json({ message: 'Video call cart is empty. Add designs first.' });
        }

        let slot = null;
        if (slotId) {
            slot = await VideoCallSlot.findById(slotId);
            if (!slot || !slot.isActive) {
                return res.status(400).json({ message: 'Selected slot is not available' });
            }
            if (slot.bookedCount >= slot.capacity) {
                return res.status(400).json({ message: 'This slot is fully booked' });
            }
        } else if (!customSlot?.date || !customSlot?.startTime) {
            return res.status(400).json({ message: 'Select an available slot or enter your preferred time' });
        }

        const booking = await VideoCallBooking.create({
            user: req.user.id,
            products,
            slot: slot?._id,
            customSlot: slot
                ? undefined
                : {
                      date: customSlot.date,
                      startTime: customSlot.startTime,
                      endTime: customSlot.endTime || customSlot.startTime,
                  },
            note: String(note).slice(0, 300),
            contactName: String(contactName).trim().slice(0, 120),
            contactEmail: String(contactEmail).trim().toLowerCase().slice(0, 160),
            status: 'pending_admin',
        });

        if (slot) {
            slot.bookedCount += 1;
            await slot.save();
        }

        // Remove booked products from server cart
        const bookedIds = new Set(products.map((p) => String(p.product)));
        user.videoCallCart = (user.videoCallCart || []).filter((id) => !bookedIds.has(String(id)));
        await user.save();

        const when = slot
            ? `${slot.date} ${slot.startTime}`
            : `${customSlot.date} ${customSlot.startTime}`;

        await notifyAllAdmins({
            title: 'New video call request',
            message: `${contactName || user.name} requested a video call for ${when} (${booking.products.length} designs).`,
            link: '/admin/video-calls?tab=requests',
        });

        await notifyUser(req.user.id, {
            title: 'Video call request sent',
            message: `Your request for ${when} was sent to admin. You will be notified when they respond.`,
            link: '/video-call/bookings',
        });

        // Realtime alert to every connected admin (ringtone on admin panel)
        const io = req.app.get('io');
        if (io) {
            io.to('admins').emit('video-call:new-request', {
                bookingId: booking._id,
                contactName: contactName || user.name,
                contactEmail: contactEmail || user.email,
                when,
                productCount: booking.products.length,
                link: '/admin/video-calls?tab=requests',
                createdAt: Date.now(),
            });
        }

        const populated = await VideoCallBooking.findById(booking._id).populate('slot');
        res.status(201).json(populated);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.pendingCount = async (req, res) => {
    try {
        const count = await VideoCallBooking.countDocuments({ status: 'pending_admin' });
        res.json({ count });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.syncCart = async (req, res) => {
    try {
        const { productIds = [] } = req.body;
        const user = await User.findById(req.user.id);
        const existing = new Set((user.videoCallCart || []).map((id) => String(id)));
        for (const id of productIds) {
            if (existing.size >= MAX_VC_CART) break;
            if (!existing.has(String(id))) {
                existing.add(String(id));
                user.videoCallCart.push(id);
            }
        }
        await user.save();
        await user.populate('videoCallCart');
        res.json({
            items: user.videoCallCart.map(productSnapshot),
            count: user.videoCallCart.length,
            max: MAX_VC_CART,
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.myBookings = async (req, res) => {
    try {
        const bookings = await VideoCallBooking.find({ user: req.user.id })
            .populate('slot')
            .sort({ createdAt: -1 });
        res.json(bookings);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.listBookingsAdmin = async (req, res) => {
    try {
        const bookings = await VideoCallBooking.find()
            .populate('slot')
            .populate('user', 'name email phone')
            .sort({ createdAt: -1 });
        res.json(bookings);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.adminRespond = async (req, res) => {
    try {
        const { action, adminNote = '' } = req.body; // accept | reject
        const booking = await VideoCallBooking.findById(req.params.id).populate('slot');
        if (!booking) return res.status(404).json({ message: 'Booking not found' });
        if (booking.status !== 'pending_admin') {
            return res.status(400).json({ message: 'Booking is not awaiting admin action' });
        }

        if (action === 'reject') {
            booking.status = 'rejected';
            booking.rejectedBy = 'admin';
            booking.adminNote = adminNote;
            await booking.save();

            if (booking.slot) {
                const slot = await VideoCallSlot.findById(booking.slot._id || booking.slot);
                if (slot && slot.bookedCount > 0) {
                    slot.bookedCount -= 1;
                    await slot.save();
                }
            }

            await notifyUser(booking.user, {
                title: 'Video call declined',
                message: adminNote || 'Admin declined your video call request. Please try another slot.',
                link: '/video-call',
            });

            return res.json(booking);
        }

        if (action !== 'accept') {
            return res.status(400).json({ message: 'action must be accept or reject' });
        }

        booking.status = 'pending_user';
        booking.adminApprovedAt = new Date();
        booking.adminNote = adminNote;
        await booking.save();

        await notifyUser(booking.user, {
            title: 'Admin approved your video call',
            message: 'Please confirm to join the video consultation.',
            link: '/video-call/bookings',
        });

        res.json(booking);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.userConfirm = async (req, res) => {
    try {
        const booking = await VideoCallBooking.findById(req.params.id).populate('slot');
        if (!booking) return res.status(404).json({ message: 'Booking not found' });
        if (booking.user.toString() !== req.user.id) {
            return res.status(403).json({ message: 'Not your booking' });
        }
        if (booking.status !== 'pending_user') {
            return res.status(400).json({ message: 'Booking is not awaiting your confirmation' });
        }

        booking.status = 'confirmed';
        booking.userConfirmedAt = new Date();
        booking.callId = makeCallId();
        await booking.save();

        await notifyAllAdmins({
            title: 'Video call confirmed',
            message: `Customer confirmed. Call is ready — join when scheduled.`,
            link: `/call/${booking.callId}`,
        });

        await notifyUser(booking.user, {
            title: 'Video call confirmed',
            message: 'Both sides approved. You can join the video call from your bookings.',
            link: `/call/${booking.callId}`,
        });

        res.json(booking);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.cancelBooking = async (req, res) => {
    try {
        const booking = await VideoCallBooking.findById(req.params.id);
        if (!booking) return res.status(404).json({ message: 'Booking not found' });

        const isOwner = booking.user.toString() === req.user.id;
        const isAdmin = req.user.role === 'admin';
        if (!isOwner && !isAdmin) {
            return res.status(403).json({ message: 'Not allowed' });
        }

        if (['confirmed', 'completed', 'cancelled', 'rejected'].includes(booking.status)) {
            return res.status(400).json({ message: 'Cannot cancel this booking' });
        }

        booking.status = 'cancelled';
        await booking.save();

        if (booking.slot) {
            const slot = await VideoCallSlot.findById(booking.slot);
            if (slot && slot.bookedCount > 0) {
                slot.bookedCount -= 1;
                await slot.save();
            }
        }

        res.json(booking);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
