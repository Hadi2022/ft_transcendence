import express from 'express'
import healthRoutes from './api/health.ts'
import statusRoutes from './api/status.ts'
import userRoutes from './api/users.ts'
import sessionRoutes from './api/sessions.ts'

const router = express.Router()

router.use('/health', healthRoutes)
router.use('/status', statusRoutes)
router.use('/users', userRoutes)
router.use('/sessions', sessionRoutes)

export default router