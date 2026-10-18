const express = require('express');
const healthRoutes = require('./api/health.ts');

const router = express.Router();

router.use('/health', healthRoutes);

module.exports = router;