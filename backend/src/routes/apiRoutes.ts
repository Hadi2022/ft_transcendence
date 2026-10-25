import express from 'express'
import healthRoutes from './api/health.ts'
import statusRoutes from './api/status.ts'
import sessionRoutes from './api/sessions.ts'

const router = express.Router()

router.use('/health', healthRoutes)
router.use('/api/status', statusRoutes)
router.use('/api/sessions', sessionRoutes)

export default router