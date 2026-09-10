/**
 * WebRTC signaling only — no media streams pass through the server.
 * Events: call:join | call:offer | call:answer | call:ice-candidate | call:end
 */
const jwt = require('jsonwebtoken');
const User = require('../models/User');

/** callId -> Map(userId -> socketId) — max 2 peers per 1:1 room */
const callRooms = new Map();

function roomName(callId) {
    return `call:${callId}`;
}

function getRoomPeers(callId) {
    if (!callRooms.has(callId)) callRooms.set(callId, new Map());
    return callRooms.get(callId);
}

async function authenticateSocket(socket) {
    const token =
        socket.handshake.auth?.token ||
        socket.handshake.headers?.authorization?.split(' ')[1];

    if (!token) throw new Error('Authentication required');

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id).select('_id name email role isBlocked userImage');
    if (!user) throw new Error('User no longer exists');
    if (user.isBlocked) throw new Error('Account is blocked');

    return {
        id: user._id.toString(),
        name: user.name,
        email: user.email,
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
        console.log(`[socket] connected user=${socket.user.id}`);

        socket.on('call:join', ({ callId }, ack) => {
            try {
                if (!callId || typeof callId !== 'string') {
                    ack?.({ ok: false, error: 'Invalid callId' });
                    return;
                }

                const peers = getRoomPeers(callId);

                // Same user reconnecting — replace old socket mapping
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
                    .map(([userId, socketId]) => ({ userId, socketId }));

                const isInitiator = peers.size === 1 || others.length === 0;

                ack?.({
                    ok: true,
                    callId,
                    userId: socket.user.id,
                    peerCount: peers.size,
                    isInitiator,
                    peers: others.map((p) => p.userId),
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
