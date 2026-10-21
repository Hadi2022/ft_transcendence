const express = require('express')
const healthRoutes = require('./api/health.ts')
const statusRoutes = require('./api/status.ts')
const sessionRoutes = require('./api/session.ts')

const router = express.Router()

router.use('/health', healthRoutes)
router.use('/api/status', statusRoutes) // should move /api to index.ts where apiRoutes is used
router.use('/api/sessions', sessionRoutes) // should move /api to index.ts where apiRoutes is used

module.exports = router
