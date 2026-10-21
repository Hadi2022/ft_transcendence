const express = require('express')
const healthRoutes = require('./api/health.ts')
const statusRoutes = require('./api/status.ts')
const userRoutes = require('./api/users.ts')

const router = express.Router()

router.use('/health', healthRoutes)
router.use('/api/status', statusRoutes)
router.use('/api/users', userRoutes)

module.exports = router
