import { Server } from "socket.io";
import http from 'http';
import express from 'express';
import { createClient } from 'redis';
import { createAdapter } from '@socket.io/redis-adapter';
import GroupConversation from '../models/groupConversation.model.js'; // Import GroupConversation model
import mongoose from "mongoose"; // Import mongoose for ObjectId validation



const app = express();
const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: ['http://localhost:3000'],
        methods: ['GET', 'POST']
    },
    pingInterval: 25000,
    pingTimeout: 60000,
});

// Define Redis URL with fallback
const redisUrl = process.env.REDIS_URL || 'redis://localhost:6379';

// Initialize Redis client and adapter
const redisClient = createClient({ url: redisUrl });
const subClient = redisClient.duplicate();

(async () => {
    try {
        await redisClient.connect();
        console.log('Redis client connected');
        redisClient.on('error', (err) => console.error('Redis Client Error', err));

        // It's important that the subClient also connects.
        await subClient.connect();
        console.log('Redis subClient connected');
        subClient.on('error', (err) => console.error('Redis SubClient Error', err));

        // Set up the adapter once both clients are connected
        io.adapter(createAdapter(redisClient, subClient));
        console.log('Socket.IO Redis adapter configured');

    } catch (err) {
        console.error('Failed to connect to Redis or set up adapter:', err);
    }
})();


// Removed getReceiverSocketId as per new requirements

io.on('connection', async (socket) => {
    console.log('A user connected:', socket.id);
    const userId = socket.handshake.query.userId;

    if (userId && userId !== 'undefined' && userId !== 'null') {
        console.log(`User ID: ${userId} for socket: ${socket.id}`);
        socket.join(userId); // User joins a room named after their userId
        console.log(`Socket ${socket.id} joined room ${userId}`);

        // Join rooms for each group the user is a participant of
        try {
            if (mongoose.Types.ObjectId.isValid(userId)) { // Ensure userId is valid before querying
                const userGroups = await GroupConversation.find({ participants: userId }).select("_id name");
                userGroups.forEach(group => {
                    const groupRoom = 'group_' + group._id.toString();
                    socket.join(groupRoom);
                    console.log(`Socket ${socket.id} (User ${userId}) joined group room: ${groupRoom} (Group Name: ${group.name})`);
                });
            } else {
                console.warn(`Invalid userId format: ${userId}, cannot fetch groups.`);
            }
        } catch (error) {
            console.error(`Error fetching or joining group rooms for user ${userId}:`, error);
        }

        // Online presence handling (remains the same)
        try {
            const alreadyOnline = await redisClient.sismember('online_users', userId);
            await redisClient.sadd('online_users', userId);
            console.log(`User ${userId} added to online_users set in Redis`);

            // Send the full list of currently online users to the newly connected client
            const allOnlineUsers = await redisClient.smembers('online_users');
            socket.emit('current_online_users', allOnlineUsers);
            console.log(`Emitted 'current_online_users' to ${socket.id}:`, allOnlineUsers);

            // Notify other clients that this user has come online,
            // but only if they weren't already marked as online (e.g. another tab/device of the same user)
            if (!alreadyOnline) {
                socket.broadcast.emit('user_online', userId);
                console.log(`Broadcasted 'user_online' for ${userId} to other clients`);
            }

        } catch (error) {
            console.error('Redis error during connection or fetching/emitting online users:', error);
            // Optionally, emit an error to the connecting socket
            socket.emit('presence_error', { message: 'Could not process online status.' });
        }
    } else {
        console.log(`Connection from socket ${socket.id} without valid userId. Query was:`, socket.handshake.query);
    }

    socket.on('disconnect', async () => {
        console.log(`User disconnected: ${socket.id}`);
        if (userId && userId !== 'undefined' && userId !== 'null') {
            try {
                // Check if the user is still connected through another socket/device.
                // This requires a more complex setup, perhaps storing socket IDs per user in Redis.
                // For now, we'll assume if one socket for a userId disconnects, they are "offline"
                // or that client-side logic handles multiple presences for the same userId gracefully.
                await redisClient.srem('online_users', userId);
                console.log(`User ${userId} removed from online_users set in Redis`);

                // Notify all other clients that this user has gone offline
                io.emit('user_offline', userId);
                console.log(`Emitted 'user_offline' for ${userId} to all clients`);

            } catch (error) {
                console.error('Redis error during disconnection or emitting offline status:', error);
            }
        }
    });
});


export {app,io,server} 
