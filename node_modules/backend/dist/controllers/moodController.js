"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getMoodHistory = exports.createMoodEntry = void 0;
const database_1 = require("../config/database");
const MoodEntry_1 = require("../models/MoodEntry");
const sentiment_1 = require("../utils/sentiment");
const demoStorage_1 = require("../utils/demoStorage");
const express_validator_1 = require("express-validator");
const moodRepository = database_1.AppDataSource.getRepository(MoodEntry_1.MoodEntry);
const isDatabaseConnected = () => {
    return database_1.AppDataSource.isInitialized;
};
const createMoodEntry = async (req, res) => {
    try {
        const errors = (0, express_validator_1.validationResult)(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        const { moodScore, text } = req.body;
        const userId = req.user.id;
        // Analyze sentiment if text is provided
        let textAnalysis = null;
        if (text) {
            textAnalysis = await (0, sentiment_1.analyzeSentiment)(text);
        }
        let moodEntry;
        if (isDatabaseConnected()) {
            // Database mode
            moodEntry = moodRepository.create({
                moodScore,
                text: text || '',
                textAnalysis,
                userId,
            });
            await moodRepository.save(moodEntry);
        }
        else {
            // Demo mode
            moodEntry = await demoStorage_1.demoStorage.saveMoodEntry({
                moodScore,
                text: text || '',
                textAnalysis,
                userId,
            });
        }
        res.status(201).json({
            id: moodEntry.id,
            moodScore: moodEntry.moodScore,
            text: moodEntry.text,
            textAnalysis: moodEntry.textAnalysis,
            timestamp: moodEntry.timestamp,
        });
    }
    catch (error) {
        console.error('Error creating mood entry:', error);
        res.status(500).json({ message: 'Failed to save mood entry' });
    }
};
exports.createMoodEntry = createMoodEntry;
const getMoodHistory = async (req, res) => {
    try {
        const userId = req.user.id;
        const limit = parseInt(req.query.limit) || 50;
        let moodEntries;
        if (isDatabaseConnected()) {
            // Database mode
            moodEntries = await moodRepository.find({
                where: { userId },
                order: { timestamp: 'DESC' },
                take: limit,
            });
        }
        else {
            // Demo mode
            moodEntries = await demoStorage_1.demoStorage.getMoodEntriesByUserId(userId);
            moodEntries = moodEntries
                .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())
                .slice(0, limit);
        }
        res.json(moodEntries);
    }
    catch (error) {
        console.error('Error fetching mood history:', error);
        res.status(500).json({ message: 'Failed to fetch mood history' });
    }
};
exports.getMoodHistory = getMoodHistory;
//# sourceMappingURL=moodController.js.map