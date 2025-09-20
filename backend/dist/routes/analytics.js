"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const analyticsController_1 = require("../controllers/analyticsController");
const auth_1 = require("../middleware/auth");
const router = (0, express_1.Router)();
// Routes
router.get('/', auth_1.authenticateJWT, analyticsController_1.getAnalytics);
exports.default = router;
//# sourceMappingURL=analytics.js.map