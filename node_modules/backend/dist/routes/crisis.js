"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const express_validator_1 = require("express-validator");
const crisisController_1 = require("../controllers/crisisController");
const auth_1 = require("../middleware/auth");
const router = (0, express_1.Router)();
// Validation rules
const alertValidation = [
    (0, express_validator_1.body)('riskLevel').isIn(['low', 'medium', 'high']).withMessage('Risk level must be low, medium, or high'),
    (0, express_validator_1.body)('triggerData').optional().isObject().withMessage('Trigger data must be an object'),
];
// Routes
router.post('/assess', auth_1.authenticateJWT, crisisController_1.assessCrisisRisk);
router.post('/alert', auth_1.authenticateJWT, alertValidation, crisisController_1.sendCrisisAlert);
exports.default = router;
//# sourceMappingURL=crisis.js.map