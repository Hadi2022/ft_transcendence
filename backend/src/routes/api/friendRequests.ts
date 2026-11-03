import express from 'express'
import { openFriendRequest } from '../../controllers/friendController.ts'
import { authed } from '../../utils/authed.ts'
import { requireAuth } from '../../middleware/auth.ts'

const router = express.Router()

router.post('/', requireAuth, authed(openFriendRequest))

export default router
