import express from 'express'
import { registerUser, getUsers, getCurrentUser, getUserById } from '../../controllers/userController.ts'
import { requireAuth } from '../../middleware/auth.ts'
import { loadUser } from '../../middleware/loadUser.ts'
import { authed } from '../../utils/authed.ts'

const router = express.Router()

router.post('/', registerUser)
router.get('/', getUsers)
router.get('/me', requireAuth, authed(getCurrentUser))
router.get('/:id', loadUser, getUserById)

export default router