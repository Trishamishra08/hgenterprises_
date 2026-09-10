/**
 * Video call signaling:
 * 1) User → call:request → admins notified
 * 2) Admin → call:accept / call:reject
 * 3) On accept both join WebRTC room via call:join + offer/answer/ICE
 */
const jwt = require('jsonwebtoken');
const User = require('../models/User');

/** callId -> Map(userId -> socketId) */
const callRooms = new Map();

/** requestId -> pending/accepted request */
const pendingRequests = new Map();

/** userId -> socketId (latest connection) */
const onlineUsers = new Map();

function roomName(callId) {
    return `call:${callId}`;
}

function getRoomPeers(callId) {
    if (!callRooms.has(callId)) callRooms.set(callId, new Map());
    return callRooms.get(callId);
}

function makeId(prefix) {
    return `${prefix}_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 8)}`;
}

function listPending() {
    return [...pendingRequests.values()]
        .filter((r) => r.status === 'pending')
        .sort((a, b) => a.createdAt - b.createdAt);
}

async function authenticateSocket(socket) {
    const token =
        socket.handshake.auth?.token ||
        socket.handshake.headers?.authorization?.split(' ')[1];

    if (!token) throw new Error('Authentication required');

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id).select('_id name email role phone isBlocked userImage');
    if (!user) throw new Error('User no longer exists');
    if (user.isBlocked) throw new Error('Account is blocked');

    return {
        id: user._id.toString(),
        name: user.name,
        email: user.email,
        phone: user.phone || '',
        role: user.role,
        userImage: user.userImage || '',
    };
}

function setupCallSignaling(io) {
    io.use(async (socket, next) => {
        try {
            socket.user = await authenticateSocket(socket);
            next();
        } catch (err) {
            next(new Error(err.message || 'Unauthorized'));
        }
    });

    io.on('connection', (socket) => {
        onlineUsers.set(socket.user.id, socket.id);

        if (socket.user.role === 'admin') {
            socket.join('admins');
            socket.emit('call:pending-list', { requests: listPending() });
        }

        console.log(`[socket] connected user=${socket.user.id} role=${socket.user.role}`);

        /** User requests a call with admin */
        socket.on('call:request', (payload, ack) => {
            try {
                if (socket.user.role === 'admin') {
                    ack?.({ ok: false, error: 'Admins receive requests; they do not send them.' });
                    return;
                }

                // One pending request per user
                for (const [id, req] of pendingRequests) {
                    if (req.userId === socket.user.id && req.status === 'pending') {
                        pendingRequests.delete(id);
                        io.to('admins').emit('call:request-cancelled', { requestId: id });
                    }
                }

                const requestId = makeId('req');
                const request = {
                    requestId,
                    userId: socket.user.id,
                    userName: socket.user.name,
                    userEmail: socket.user.email,
                    userPhone: socket.user.phone,
                    userImage: socket.user.userImage,
                    note: typeof payload?.note === 'string' ? payload.note.slice(0, 200) : '',
                    status: 'pending',
                    createdAt: Date.now(),
                    userSocketId: socket.id,
                };

                pendingRequests.set(requestId, request);
                socket.data.requestId = requestId;

                io.to('admins').emit('call:incoming-request', { request });
                ack?.({ ok: true, requestId, status: 'pending' });
            } catch (err) {
                ack?.({ ok: false, error: err.message });
            }
        });

        /** User cancels their pending request */
        socket.on('call:cancel-request', ({ requestId } = {}, ack) => {
            const req = pendingRequests.get(requestId);
            if (!req || req.userId !== socket.user.id) {
                ack?.({ ok: false, error: 'Request not found' });
                return;
            }
            if (req.status !== 'pending') {
                ack?.({ ok: false, error: 'Request is no longer pending' });
                return;
            }

            pendingRequests.delete(requestId);
            socket.data.requestId = null;
            io.to('admins').emit('call:request-cancelled', { requestId });
            ack?.({ ok: true });
        });

        /** Admin accepts → both get callId */
        socket.on('call:accept', ({ requestId } = {}, ack) => {
            try {
                if (socket.user.role !== 'admin') {
                    ack?.({ ok: false, error: 'Only admins can accept call requests' });
                    return;
                }

                const req = pendingRequests.get(requestId);
                if (!req || req.status !== 'pending') {
                    ack?.({ ok: false, error: 'Request is not available' });
                    return;
                }

                const callId = makeId('call');
                req.status = 'accepted';
                req.callId = callId;
                req.adminId = socket.user.id;
                req.adminName = socket.user.name;
                req.acceptedAt = Date.now();

                const payload = {
                    requestId,
                    callId,
                    userId: req.userId,
                    userName: req.userName,
                    adminId: socket.user.id,
                    adminName: socket.user.name,
                };

                // Notify requesting user
                const userSocketId = onlineUsers.get(req.userId);
                if (userSocketId) {
                    io.to(userSocketId).emit('call:accepted', payload);
                }

                // Notify accepting admin (and clear request from other admins' lists)
                socket.emit('call:accepted', payload);
                io.to('admins').emit('call:request-resolved', {
                    requestId,
                    status: 'accepted',
                    acceptedBy: socket.user.id,
                });

                // Keep briefly for join authorization, then drop
                setTimeout(() => pendingRequests.delete(requestId), 5 * 60 * 1000);

                ack?.({ ok: true, callId, requestId });
            } catch (err) {
                ack?.({ ok: false, error: err.message });
            }
        });

        /** Admin rejects */
        socket.on('call:reject', ({ requestId, reason } = {}, ack) => {
            try {
                if (socket.user.role !== 'admin') {
                    ack?.({ ok: false, error: 'Only admins can reject call requests' });
                    return;
                }

                const req = pendingRequests.get(requestId);
                if (!req || req.status !== 'pending') {
                    ack?.({ ok: false, error: 'Request is not available' });
                    return;
                }

                req.status = 'rejected';
                pendingRequests.delete(requestId);

                const userSocketId = onlineUsers.get(req.userId);
                if (userSocketId) {
                    io.to(userSocketId).emit('call:rejected', {
                        requestId,
                        reason: reason || 'Admin declined the call request.',
                    });
                }

                io.to('admins').emit('call:request-resolved', {
                    requestId,
                    status: 'rejected',
                });

                ack?.({ ok: true });
            } catch (err) {
                ack?.({ ok: false, error: err.message });
            }
        });

        /** Admin refreshes pending list */
        socket.on('call:list-pending', (ack) => {
            if (socket.user.role !== 'admin') {
                ack?.({ ok: false, error: 'Admin only' });
                return;
            }
            ack?.({ ok: true, requests: listPending() });
        });

        socket.on('call:join', ({ callId }, ack) => {
            try {
                if (!callId || typeof callId !== 'string') {
                    ack?.({ ok: false, error: 'Invalid callId' });
                    return;
                }

                // Authorize: must be participant of an accepted request (or already in room)
                const authorized = [...pendingRequests.values()].some(
                    (r) =>
                        r.callId === callId &&
                        (r.userId === socket.user.id || r.adminId === socket.user.id)
                );
                const peers = getRoomPeers(callId);
                const alreadyIn = peers.has(socket.user.id);

                if (!authorized && !alreadyIn && peers.size === 0) {
                    // Allow join if room already has a peer from this call session
                    // (accepted request may have been cleaned) — only if room exists with 1 peer
                }

                if (!authorized && !alreadyIn && peers.size === 0) {
                    // Soft allow: accepted payload navigates with callId; first joiner creates room
                    // Prefer checking any accepted request still in map
                    const anyMatch = [...pendingRequests.values()].find((r) => r.callId === callId);
                    if (anyMatch && anyMatch.userId !== socket.user.id && anyMatch.adminId !== socket.user.id) {
                        ack?.({ ok: false, error: 'Not allowed to join this call' });
                        return;
                    }
                }

                if (peers.has(socket.user.id)) {
                    peers.set(socket.user.id, socket.id);
                } else if (peers.size >= 2) {
                    ack?.({ ok: false, error: 'Call is full (1-to-1 only)' });
                    return;
                } else {
                    peers.set(socket.user.id, socket.id);
                }

                socket.join(roomName(callId));
                socket.data.callId = callId;

                const others = [...peers.entries()]
                    .filter(([uid]) => uid !== socket.user.id)
                    .map(([userId]) => userId);

                const isInitiator = peers.size === 1 || others.length === 0;

                ack?.({
                    ok: true,
                    callId,
                    userId: socket.user.id,
                    peerCount: peers.size,
                    isInitiator,
                    peers: others,
                });

                if (others.length > 0) {
                    socket.to(roomName(callId)).emit('call:peer-joined', {
                        callId,
                        userId: socket.user.id,
                        name: socket.user.name,
                    });
                }
            } catch (err) {
                ack?.({ ok: false, error: err.message });
            }
        });

        socket.on('call:offer', ({ callId, offer, targetUserId }) => {
            if (!callId || !offer) return;
            if (socket.data.callId !== callId) return;
            const peers = getRoomPeers(callId);
            if (!peers.has(socket.user.id)) return;

            const payload = {
                callId,
                offer,
                fromUserId: socket.user.id,
                fromName: socket.user.name,
            };

            if (targetUserId && peers.has(targetUserId)) {
                io.to(peers.get(targetUserId)).emit('call:offer', payload);
            } else {
                socket.to(roomName(callId)).emit('call:offer', payload);
            }
        });

        socket.on('call:answer', ({ callId, answer, targetUserId }) => {
            if (!callId || !answer) return;
            if (socket.data.callId !== callId) return;
            const peers = getRoomPeers(callId);
            if (!peers.has(socket.user.id)) return;

            const payload = {
                callId,
                answer,
                fromUserId: socket.user.id,
            };

            if (targetUserId && peers.has(targetUserId)) {
                io.to(peers.get(targetUserId)).emit('call:answer', payload);
            } else {
                socket.to(roomName(callId)).emit('call:answer', payload);
            }
        });

        socket.on('call:ice-candidate', ({ callId, candidate, targetUserId }) => {
            if (!callId || !candidate) return;
            if (socket.data.callId !== callId) return;
            const peers = getRoomPeers(callId);
            if (!peers.has(socket.user.id)) return;

            const payload = {
                callId,
                candidate,
                fromUserId: socket.user.id,
            };

            if (targetUserId && peers.has(targetUserId)) {
                io.to(peers.get(targetUserId)).emit('call:ice-candidate', payload);
            } else {
                socket.to(roomName(callId)).emit('call:ice-candidate', payload);
            }
        });

        socket.on('call:end', ({ callId }) => {
            leaveCall(socket, callId, true);
        });

        socket.on('disconnect', () => {
            if (onlineUsers.get(socket.user.id) === socket.id) {
                onlineUsers.delete(socket.user.id);
            }

            // Cancel pending request if user disconnects
            if (socket.data.requestId) {
                const req = pendingRequests.get(socket.data.requestId);
                if (req && req.status === 'pending' && req.userId === socket.user.id) {
                    pendingRequests.delete(socket.data.requestId);
                    io.to('admins').emit('call:request-cancelled', {
                        requestId: socket.data.requestId,
                    });
                }
            }

            if (socket.data.callId) {
                leaveCall(socket, socket.data.callId, true);
            }
            console.log(`[socket] disconnected user=${socket.user.id}`);
        });
    });
}

function leaveCall(socket, callId, notifyPeer) {
    if (!callId) return;
    const peers = getRoomPeers(callId);
    const wasInRoom = peers.has(socket.user.id) && peers.get(socket.user.id) === socket.id;

    if (notifyPeer && wasInRoom) {
        socket.to(roomName(callId)).emit('call:ended', {
            callId,
            fromUserId: socket.user.id,
            reason: 'peer-left',
        });
    }

    if (wasInRoom) {
        peers.delete(socket.user.id);
    }

    socket.leave(roomName(callId));
    socket.data.callId = null;

    if (peers.size === 0) {
        callRooms.delete(callId);
    }
}

module.exports = { setupCallSignaling };
