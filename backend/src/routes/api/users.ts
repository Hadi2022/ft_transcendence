import express from 'express'
import { registerUser, getUsers, getCurrentUser, getUserById, getUserByUsername, updateCurrentUser, setAvatar, clearAvatar, getFollowings, followUser , unfollowUser, followInfo, getFollowers} from '../../controllers/userController.ts'
import { requireAuth } from '../../middleware/auth.ts'
import { loadUser } from '../../middleware/loadUser.ts'
import { authed } from '../../utils/authed.ts'
import { imageUpload } from '../../middleware/imageUpload.ts'
import { AVATAR_MAX_SIZE } from '../../constants/imageUpload.ts'

const router = express.Router()

router.post('/', registerUser)
router.get('/', getUsers)
router.get('/me', requireAuth, authed(getCurrentUser))
router.patch('/me', requireAuth, authed(updateCurrentUser))
router.put('/me/avatar', requireAuth, imageUpload('avatar', AVATAR_MAX_SIZE), authed(setAvatar))
router.delete('/me/avatar', requireAuth, authed(clearAvatar))
router.get('/by-username/:username', getUserByUsername)
router.get('/:id', loadUser, getUserById)
router.get('/:id/following', requireAuth, loadUser, authed(getFollowings))
router.get('/:id/followers', requireAuth, loadUser, authed(getFollowers))
router.post('/:id/followers', requireAuth, loadUser, authed(followUser))
router.delete('/:id/followers', requireAuth, loadUser, authed(unfollowUser))
router.get('/:id/follow-info', loadUser, followInfo)

export default router
