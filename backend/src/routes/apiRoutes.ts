const express = require('express');
const healthRoutes = require('./api/health.ts');
const statusRoutes = require('./api/status.ts');

const router = express.Router();

router.use('/health', healthRoutes);
router.use('/api/status', statusRoutes);

module.exports = router;