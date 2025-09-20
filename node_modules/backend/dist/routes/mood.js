"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const express_validator_1 = require("express-validator");
const moodController_1 = require("../controllers/moodController");
const auth_1 = require("../middleware/auth");
const router = (0, express_1.Router)();
// Validation rules
const moodEntryValidation = [
    (0, express_validator_1.body)('moodScore').isInt({ min: 1, max: 10 }).withMessage('Mood score must be between 1 and 10'),
    (0, express_validator_1.body)('text').optional().isString().withMessage('Text must be a string'),
];
// Routes
router.post('/', auth_1.authenticateJWT, moodEntryValidation, moodController_1.createMoodEntry);
router.get('/history', auth_1.authenticateJWT, moodController_1.getMoodHistory);
exports.default = router;
//# sourceMappingURL=mood.js.map