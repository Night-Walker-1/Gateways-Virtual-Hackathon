"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.me = exports.refresh = exports.login = exports.register = void 0;
const bcrypt_1 = __importDefault(require("bcrypt"));
const express_validator_1 = require("express-validator");
const database_1 = require("../config/database");
const User_1 = require("../models/User");
const jwt_1 = require("../utils/jwt");
const demoStorage_1 = require("../utils/demoStorage");
const userRepository = database_1.AppDataSource.getRepository(User_1.User);
// Check if database is connected
const isDatabaseConnected = () => {
    return database_1.AppDataSource.isInitialized;
};
const register = async (req, res) => {
    try {
        const errors = (0, express_validator_1.validationResult)(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        const { email, password, name, emergencyContacts } = req.body;
        if (isDatabaseConnected()) {
            // Database mode
            const existingUser = await userRepository.findOne({ where: { email } });
            if (existingUser) {
                return res.status(409).json({ error: 'User already exists with this email' });
            }
            const saltRounds = 12;
            const passwordHash = await bcrypt_1.default.hash(password, saltRounds);
            const user = userRepository.create({
                email,
                passwordHash,
                name,
                emergencyContacts: emergencyContacts || [],
            });
            await userRepository.save(user);
            const accessToken = (0, jwt_1.generateAccessToken)({ userId: user.id, email: user.email });
            const refreshToken = (0, jwt_1.generateRefreshToken)({ userId: user.id, email: user.email });
            res.status(201).json({
                message: 'User created successfully',
                user: {
                    id: user.id,
                    email: user.email,
                    name: user.name,
                    emergencyContacts: user.emergencyContacts,
                },
                accessToken,
                refreshToken,
            });
        }
        else {
            // Demo mode
            const existingUser = await demoStorage_1.demoStorage.findUserByEmail(email);
            if (existingUser) {
                return res.status(409).json({ error: 'User already exists with this email' });
            }
            const user = await demoStorage_1.demoStorage.createUser({
                email,
                password,
                name,
                emergencyContacts: emergencyContacts || [],
            });
            const accessToken = (0, jwt_1.generateAccessToken)({ userId: user.id, email: user.email });
            const refreshToken = (0, jwt_1.generateRefreshToken)({ userId: user.id, email: user.email });
            res.status(201).json({
                message: 'User created successfully (Demo Mode)',
                user: {
                    id: user.id,
                    email: user.email,
                    name: user.name,
                    emergencyContacts: user.emergencyContacts,
                },
                accessToken,
                refreshToken,
            });
        }
    }
    catch (error) {
        console.error('Registration error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};
exports.register = register;
const login = async (req, res) => {
    try {
        const errors = (0, express_validator_1.validationResult)(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        const { email, password } = req.body;
        if (isDatabaseConnected()) {
            // Database mode
            const user = await userRepository.findOne({ where: { email } });
            if (!user) {
                return res.status(401).json({ error: 'Invalid credentials' });
            }
            const isPasswordValid = await bcrypt_1.default.compare(password, user.passwordHash);
            if (!isPasswordValid) {
                return res.status(401).json({ error: 'Invalid credentials' });
            }
            const accessToken = (0, jwt_1.generateAccessToken)({ userId: user.id, email: user.email });
            const refreshToken = (0, jwt_1.generateRefreshToken)({ userId: user.id, email: user.email });
            res.json({
                message: 'Login successful',
                user: {
                    id: user.id,
                    email: user.email,
                    name: user.name,
                    emergencyContacts: user.emergencyContacts,
                },
                accessToken,
                refreshToken,
            });
        }
        else {
            // Demo mode
            const user = await demoStorage_1.demoStorage.findUserByEmail(email);
            if (!user) {
                return res.status(401).json({ error: 'Invalid credentials' });
            }
            const isPasswordValid = await bcrypt_1.default.compare(password, user.passwordHash);
            if (!isPasswordValid) {
                return res.status(401).json({ error: 'Invalid credentials' });
            }
            const accessToken = (0, jwt_1.generateAccessToken)({ userId: user.id, email: user.email });
            const refreshToken = (0, jwt_1.generateRefreshToken)({ userId: user.id, email: user.email });
            res.json({
                message: 'Login successful (Demo Mode)',
                user: {
                    id: user.id,
                    email: user.email,
                    name: user.name,
                    emergencyContacts: user.emergencyContacts,
                },
                accessToken,
                refreshToken,
            });
        }
    }
    catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};
exports.login = login;
const refresh = async (req, res) => {
    try {
        const { refreshToken } = req.body;
        if (!refreshToken) {
            return res.status(401).json({ error: 'Refresh token required' });
        }
        const payload = (0, jwt_1.verifyRefreshToken)(refreshToken);
        const newAccessToken = (0, jwt_1.generateAccessToken)({ userId: payload.userId, email: payload.email });
        res.json({
            accessToken: newAccessToken,
        });
    }
    catch (error) {
        console.error('Token refresh error:', error);
        res.status(403).json({ error: 'Invalid or expired refresh token' });
    }
};
exports.refresh = refresh;
const me = async (req, res) => {
    try {
        const userId = req.user?.userId;
        if (isDatabaseConnected()) {
            // Database mode
            const user = await userRepository.findOne({ where: { id: userId } });
            if (!user) {
                return res.status(404).json({ error: 'User not found' });
            }
            res.json({
                user: {
                    id: user.id,
                    email: user.email,
                    name: user.name,
                    emergencyContacts: user.emergencyContacts,
                    createdAt: user.createdAt,
                    updatedAt: user.updatedAt,
                },
            });
        }
        else {
            // Demo mode
            const user = await demoStorage_1.demoStorage.findUserById(userId);
            if (!user) {
                return res.status(404).json({ error: 'User not found' });
            }
            res.json({
                user: {
                    id: user.id,
                    email: user.email,
                    name: user.name,
                    emergencyContacts: user.emergencyContacts,
                    createdAt: user.createdAt,
                    updatedAt: user.updatedAt,
                },
            });
        }
    }
    catch (error) {
        console.error('Get user error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};
exports.me = me;
//# sourceMappingURL=authController.js.map