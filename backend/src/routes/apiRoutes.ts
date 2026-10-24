import express from 'express'
import healthRoutes from './api/health.ts'
import statusRoutes from './api/status.ts'
import userRoutes from './api/users.ts'

const router = express.Router()

router.use('/health', healthRoutes)
router.use('/api/status', statusRoutes)
router.use('/api/users', userRoutes)

export default router
