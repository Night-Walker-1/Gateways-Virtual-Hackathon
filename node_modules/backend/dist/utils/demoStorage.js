"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.demoStorage = void 0;
// In-memory storage for demo mode when database is not available
const bcrypt_1 = __importDefault(require("bcrypt"));
const crypto_1 = require("crypto");
class DemoStorage {
    constructor() {
        this.users = new Map();
        this.conversations = [];
        this.emotions = [];
        this.moodEntries = [];
        this.crisisAlerts = [];
    }
    // User operations
    async createUser(userData) {
        const id = (0, crypto_1.randomUUID)();
        const passwordHash = await bcrypt_1.default.hash(userData.password, 12);
        const user = {
            id,
            email: userData.email,
            passwordHash,
            name: userData.name,
            emergencyContacts: userData.emergencyContacts || [],
            createdAt: new Date(),
            updatedAt: new Date(),
        };
        this.users.set(id, user);
        return user;
    }
    async findUserByEmail(email) {
        for (const user of this.users.values()) {
            if (user.email === email) {
                return user;
            }
        }
        return null;
    }
    async findUserById(id) {
        return this.users.get(id) || null;
    }
    // Conversation operations
    async saveConversation(conversationData) {
        const conversation = {
            id: (0, crypto_1.randomUUID)(),
            ...conversationData,
            timestamp: new Date(),
        };
        this.conversations.push(conversation);
        return conversation;
    }
    async getConversationsByUserId(userId) {
        return this.conversations.filter(conv => conv.userId === userId);
    }
    // Emotion operations
    async saveEmotion(emotionData) {
        const emotion = {
            id: (0, crypto_1.randomUUID)(),
            ...emotionData,
            timestamp: new Date(),
        };
        this.emotions.push(emotion);
        return emotion;
    }
    async getEmotionsByUserId(userId) {
        return this.emotions.filter(emotion => emotion.userId === userId);
    }
    // Mood entry operations
    async saveMoodEntry(moodData) {
        const moodEntry = {
            id: (0, crypto_1.randomUUID)(),
            ...moodData,
            timestamp: new Date(),
        };
        this.moodEntries.push(moodEntry);
        return moodEntry;
    }
    async getMoodEntriesByUserId(userId) {
        return this.moodEntries.filter(mood => mood.userId === userId);
    }
    // Crisis alert operations
    async saveCrisisAlert(crisisData) {
        const crisisAlert = {
            id: (0, crypto_1.randomUUID)(),
            ...crisisData,
            resolved: false,
            timestamp: new Date(),
        };
        this.crisisAlerts.push(crisisAlert);
        return crisisAlert;
    }
    async getCrisisAlertsByUserId(userId) {
        return this.crisisAlerts.filter(alert => alert.userId === userId);
    }
    async getConversationHistory(userId, limit = 10) {
        return this.conversations
            .filter(conv => conv.userId === userId)
            .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())
            .slice(0, limit)
            .reverse()
            .map(conv => ({
            message: conv.message,
            response: conv.response
        }));
    }
    // Initialize with demo user
    async initializeDemo() {
        const demoUser = await this.createUser({
            email: 'demo@mindguard.ai',
            password: 'demo123',
            name: 'Demo User',
            emergencyContacts: [
                {
                    name: 'Emergency Contact',
                    phone: '+1-555-0123',
                    relationship: 'Friend'
                }
            ]
        });
        console.log('🎭 Demo user created:');
        console.log('   Email: demo@mindguard.ai');
        console.log('   Password: demo123');
        return demoUser;
    }
}
exports.demoStorage = new DemoStorage();
//# sourceMappingURL=demoStorage.js.map