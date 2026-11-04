import express from 'express'
import {
    getFriendRequests,
    openFriendRequest,
    deleteFriendRequest
} from '../../controllers/friendController.ts'
import { authed } from '../../utils/authed.ts'
import { requireAuth } from '../../middleware/auth.ts'

const router = express.Router()

router.post('/', requireAuth, authed(openFriendRequest))
router.get('/', requireAuth, authed(getFriendRequests))
router.delete('/:id', requireAuth, authed(deleteFriendRequest))

export default router
