"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.setupEmotionNamespace = void 0;
const database_1 = require("../config/database");
const Emotion_1 = require("../models/Emotion");
const demoStorage_1 = require("../utils/demoStorage");
const emotionRepository = database_1.AppDataSource.getRepository(Emotion_1.Emotion);
const isDatabaseConnected = () => {
    return database_1.AppDataSource.isInitialized;
};
const setupEmotionNamespace = (io) => {
    const emotionNamespace = io.of('/emotion');
    emotionNamespace.on('connection', (socket) => {
        console.log('Client connected to emotion detection:', socket.id);
        socket.on('join', (userId) => {
            socket.join(`user-${userId}`);
            console.log(`User ${userId} joined emotion detection`);
        });
        socket.on('emotion_data', async (data) => {
            try {
                console.log('Received emotion data:', data);
                let emotion;
                if (isDatabaseConnected()) {
                    // Database mode
                    emotion = emotionRepository.create({
                        emotion: data.emotion,
                        confidence: data.confidence,
                        userId: data.userId,
                    });
                    await emotionRepository.save(emotion);
                }
                else {
                    // Demo mode
                    emotion = await demoStorage_1.demoStorage.saveEmotion({
                        emotion: data.emotion,
                        confidence: data.confidence,
                        userId: data.userId,
                    });
                }
                // Emit confirmation back to user
                socket.emit('emotion_saved', {
                    id: emotion.id,
                    emotion: emotion.emotion,
                    confidence: emotion.confidence,
                    timestamp: emotion.timestamp,
                });
                // Broadcast to other connected devices for the same user
                socket.to(`user-${data.userId}`).emit('emotion_update', {
                    id: emotion.id,
                    emotion: emotion.emotion,
                    confidence: emotion.confidence,
                    timestamp: emotion.timestamp,
                });
            }
            catch (error) {
                console.error('Error saving emotion data:', error);
                socket.emit('error', { message: 'Failed to save emotion data' });
            }
        });
        socket.on('get_emotion_history', async (data) => {
            try {
                let emotions;
                if (isDatabaseConnected()) {
                    // Database mode
                    emotions = await emotionRepository.find({
                        where: { userId: data.userId },
                        order: { timestamp: 'DESC' },
                        take: data.limit || 50,
                    });
                }
                else {
                    // Demo mode
                    emotions = await demoStorage_1.demoStorage.getEmotionsByUserId(data.userId);
                    emotions = emotions
                        .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())
                        .slice(0, data.limit || 50);
                }
                socket.emit('emotion_history', emotions);
            }
            catch (error) {
                console.error('Error fetching emotion history:', error);
                socket.emit('error', { message: 'Failed to fetch emotion history' });
            }
        });
        socket.on('disconnect', () => {
            console.log('Client disconnected from emotion detection:', socket.id);
        });
    });
    return emotionNamespace;
};
exports.setupEmotionNamespace = setupEmotionNamespace;
//# sourceMappingURL=emotionController.js.map