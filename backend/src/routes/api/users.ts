import express from 'express'
import { registerUser, getCurrentUser } from '../../controllers/userController.ts'
import { requireAuth } from '../../middleware/auth.ts'
import { authed } from '../../utils/authed.ts'

const router = express.Router()

router.post('/', registerUser)
router.get('/me', requireAuth, authed(getCurrentUser))

export default router