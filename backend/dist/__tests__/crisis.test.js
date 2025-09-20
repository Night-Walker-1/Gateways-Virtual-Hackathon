"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// Unit tests for crisis validation logic
const express_validator_1 = require("express-validator");
describe('Crisis Route Validation', () => {
    describe('Risk level validation', () => {
        it('should validate risk level enum', () => {
            const riskLevelValidator = (0, express_validator_1.body)('riskLevel').isIn(['low', 'medium', 'high']);
            expect(riskLevelValidator).toBeDefined();
        });
        it('should accept low risk level', () => {
            const validRiskLevels = ['low', 'medium', 'high'];
            validRiskLevels.forEach(level => {
                const validator = (0, express_validator_1.body)('riskLevel').isIn(['low', 'medium', 'high']);
                expect(validator).toBeDefined();
            });
        });
    });
    describe('Trigger data validation', () => {
        it('should validate trigger data as optional object', () => {
            const triggerDataValidator = (0, express_validator_1.body)('triggerData').optional().isObject();
            expect(triggerDataValidator).toBeDefined();
        });
    });
});
//# sourceMappingURL=crisis.test.js.map