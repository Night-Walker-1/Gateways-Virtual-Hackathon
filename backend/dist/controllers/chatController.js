"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.setupChatNamespace = void 0;
const database_1 = require("../config/database");
const Conversation_1 = require("../models/Conversation");
const groq_ai_service_1 = require("../utils/groq-ai-service");
const sentiment_1 = require("../utils/sentiment");
const demoStorage_1 = require("../utils/demoStorage");
const conversationRepository = database_1.AppDataSource.getRepository(Conversation_1.Conversation);
const isDatabaseConnected = () => {
    return database_1.AppDataSource.isInitialized;
};
const setupChatNamespace = (io) => {
    const chatNamespace = io.of('/chat');
    chatNamespace.on('connection', (socket) => {
        console.log('Client connected to chat:', socket.id);
        socket.on('join', (userId) => {
            socket.join(`user-${userId}`);
            console.log(`User ${userId} joined chat`);
        });
        socket.on('message', async (data) => {
            try {
                console.log('Received message:', data);
                // Analyze sentiment
                const sentimentScore = await (0, sentiment_1.analyzeSentiment)(data.message);
                // Get conversation history
                let conversationHistory = [];
                if (isDatabaseConnected()) {
                    // Get last 10 conversations from database
                    const recentConversations = await conversationRepository.find({
                        where: { userId: data.userId },
                        order: { timestamp: 'DESC' },
                        take: 10
                    });
                    conversationHistory = recentConversations.reverse().map(conv => ({
                        message: conv.message,
                        response: conv.response
                    }));
                }
                else {
                    // Get from demo storage
                    conversationHistory = await demoStorage_1.demoStorage.getConversationHistory(data.userId);
                }
                // Generate AI response using Groq with enhanced mental health capabilities
                let response;
                try {
                    const groqResponse = await (0, groq_ai_service_1.generateGroqResponse)(data.message, data.userId, {
                        conversationHistory: conversationHistory,
                        currentMood: sentimentScore > 0.1 ? 'positive' : sentimentScore < -0.1 ? 'negative' : 'neutral'
                    }, sentimentScore);
                    response = groqResponse.response;
                }
                catch (error) {
                    console.error('Chat Controller - GROQ Error:', error);
                    response = `Sorry, I'm experiencing technical difficulties with the AI service. Error: ${error instanceof Error ? error.message : 'Unknown error'}`;
                }
                let conversation;
                if (isDatabaseConnected()) {
                    // Database mode
                    conversation = conversationRepository.create({
                        message: data.message,
                        response: response,
                        sentimentScore: sentimentScore,
                        userId: data.userId,
                    });
                    await conversationRepository.save(conversation);
                }
                else {
                    // Demo mode
                    conversation = await demoStorage_1.demoStorage.saveConversation({
                        message: data.message,
                        response: response,
                        sentimentScore: sentimentScore,
                        userId: data.userId,
                    });
                }
                // Emit response back to user
                const responseData = {
                    id: conversation.id,
                    message: data.message,
                    response: response,
                    sentimentScore: sentimentScore,
                    timestamp: conversation.timestamp,
                };
                socket.to(`user-${data.userId}`).emit('response', responseData);
                socket.emit('response', responseData);
            }
            catch (error) {
                console.error('Error processing chat message:', error);
                socket.emit('error', { message: 'Failed to process message' });
            }
        });
        socket.on('typing', (data) => {
            socket.to(`user-${data.userId}`).emit('typing', data);
        });
        socket.on('disconnect', () => {
            console.log('Client disconnected from chat:', socket.id);
        });
    });
    return chatNamespace;
};
exports.setupChatNamespace = setupChatNamespace;
//# sourceMappingURL=chatController.js.map