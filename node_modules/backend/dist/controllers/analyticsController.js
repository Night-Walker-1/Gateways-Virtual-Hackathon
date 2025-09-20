"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAnalytics = void 0;
const database_1 = require("../config/database");
const MoodEntry_1 = require("../models/MoodEntry");
const Emotion_1 = require("../models/Emotion");
const Conversation_1 = require("../models/Conversation");
const demoStorage_1 = require("../utils/demoStorage");
const moodRepository = database_1.AppDataSource.getRepository(MoodEntry_1.MoodEntry);
const emotionRepository = database_1.AppDataSource.getRepository(Emotion_1.Emotion);
const conversationRepository = database_1.AppDataSource.getRepository(Conversation_1.Conversation);
const isDatabaseConnected = () => {
    return database_1.AppDataSource.isInitialized;
};
// Helper function to group data by date
const groupByDate = (data, dateKey = 'timestamp') => {
    const grouped = {};
    data.forEach(item => {
        const date = new Date(item[dateKey]).toISOString().split('T')[0];
        if (!grouped[date]) {
            grouped[date] = [];
        }
        grouped[date].push(item);
    });
    return grouped;
};
// Helper function to get date range
const getDateRange = (days) => {
    const dates = [];
    for (let i = days - 1; i >= 0; i--) {
        const date = new Date();
        date.setDate(date.getDate() - i);
        dates.push(date.toISOString().split('T')[0]);
    }
    return dates;
};
const getAnalytics = async (req, res) => {
    try {
        const userId = req.user.id;
        const days = parseInt(req.query.days) || 30;
        // Fetch data for the specified period
        let moodEntries, emotions, conversations;
        if (isDatabaseConnected()) {
            // Database mode
            const startDate = new Date();
            startDate.setDate(startDate.getDate() - days);
            moodEntries = await moodRepository.find({
                where: { userId },
                order: { timestamp: 'DESC' },
            });
            emotions = await emotionRepository.find({
                where: { userId },
                order: { timestamp: 'DESC' },
            });
            conversations = await conversationRepository.find({
                where: { userId },
                order: { timestamp: 'DESC' },
            });
        }
        else {
            // Demo mode
            moodEntries = await demoStorage_1.demoStorage.getMoodEntriesByUserId(userId);
            emotions = await demoStorage_1.demoStorage.getEmotionsByUserId(userId);
            conversations = await demoStorage_1.demoStorage.getConversationsByUserId(userId);
        }
        // Filter data for the requested period
        const cutoffDate = new Date();
        cutoffDate.setDate(cutoffDate.getDate() - days);
        moodEntries = moodEntries.filter(entry => new Date(entry.timestamp) >= cutoffDate);
        emotions = emotions.filter(emotion => new Date(emotion.timestamp) >= cutoffDate);
        conversations = conversations.filter(conv => new Date(conv.timestamp) >= cutoffDate);
        // Process mood trends
        const moodByDate = groupByDate(moodEntries);
        const dateRange = getDateRange(days);
        const moodTrends = dateRange.map(date => {
            const dayMoods = moodByDate[date] || [];
            const avgMood = dayMoods.length > 0
                ? dayMoods.reduce((sum, mood) => sum + mood.moodScore, 0) / dayMoods.length
                : null;
            return {
                date,
                averageMood: avgMood ? parseFloat(avgMood.toFixed(1)) : null,
                entryCount: dayMoods.length
            };
        });
        // Process emotion distribution
        const emotionCounts = {};
        emotions.forEach(emotion => {
            emotionCounts[emotion.emotion] = (emotionCounts[emotion.emotion] || 0) + 1;
        });
        const emotionDistribution = Object.entries(emotionCounts).map(([emotion, count]) => ({
            emotion,
            count,
            percentage: ((count / emotions.length) * 100).toFixed(1)
        }));
        // Process sentiment trends
        const conversationsByDate = groupByDate(conversations);
        const sentimentTrends = dateRange.map(date => {
            const dayConversations = conversationsByDate[date] || [];
            const avgSentiment = dayConversations.length > 0
                ? dayConversations.reduce((sum, conv) => sum + (conv.sentimentScore || 0), 0) / dayConversations.length
                : null;
            return {
                date,
                averageSentiment: avgSentiment ? parseFloat(avgSentiment.toFixed(2)) : null,
                conversationCount: dayConversations.length
            };
        });
        // Calculate summary statistics
        const totalMoodEntries = moodEntries.length;
        const totalEmotions = emotions.length;
        const totalConversations = conversations.length;
        const avgMoodScore = totalMoodEntries > 0
            ? moodEntries.reduce((sum, mood) => sum + mood.moodScore, 0) / totalMoodEntries
            : 0;
        const avgSentimentScore = totalConversations > 0
            ? conversations.reduce((sum, conv) => sum + (conv.sentimentScore || 0), 0) / totalConversations
            : 0;
        const mostFrequentEmotion = emotionDistribution.length > 0
            ? emotionDistribution.reduce((max, emotion) => emotion.count > max.count ? emotion : max).emotion
            : 'none';
        const analytics = {
            summary: {
                totalMoodEntries,
                totalEmotions,
                totalConversations,
                averageMoodScore: parseFloat(avgMoodScore.toFixed(1)),
                averageSentimentScore: parseFloat(avgSentimentScore.toFixed(2)),
                mostFrequentEmotion,
                periodDays: days
            },
            moodTrends,
            emotionDistribution,
            sentimentTrends
        };
        res.json(analytics);
    }
    catch (error) {
        console.error('Error generating analytics:', error);
        res.status(500).json({ message: 'Failed to generate analytics' });
    }
};
exports.getAnalytics = getAnalytics;
//# sourceMappingURL=analyticsController.js.map