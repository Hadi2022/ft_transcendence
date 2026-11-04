import express from 'express'
import { openFriendRequest, deleteFriendRequest } from '../../controllers/friendController.ts'
import { authed } from '../../utils/authed.ts'
import { requireAuth } from '../../middleware/auth.ts'

const router = express.Router()

router.post('/', requireAuth, authed(openFriendRequest))
router.delete('/:id', requireAuth, authed(deleteFriendRequest))

export default router
