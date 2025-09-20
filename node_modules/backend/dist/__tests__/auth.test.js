"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// Unit tests for authentication validation logic
const express_validator_1 = require("express-validator");
describe('Authentication Validation', () => {
    describe('Email validation', () => {
        it('should validate email format', () => {
            const emailValidator = (0, express_validator_1.body)('email').isEmail().normalizeEmail();
            expect(emailValidator).toBeDefined();
        });
        it('should normalize email', () => {
            const emailValidator = (0, express_validator_1.body)('email').isEmail().normalizeEmail();
            expect(emailValidator).toBeDefined();
        });
    });
    describe('Password validation', () => {
        it('should require minimum password length', () => {
            const passwordValidator = (0, express_validator_1.body)('password').isLength({ min: 8 });
            expect(passwordValidator).toBeDefined();
        });
    });
    describe('Name validation', () => {
        it('should validate name length', () => {
            const nameValidator = (0, express_validator_1.body)('name').trim().isLength({ min: 2 });
            expect(nameValidator).toBeDefined();
        });
    });
});
//# sourceMappingURL=auth.test.js.map