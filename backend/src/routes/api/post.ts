import express from 'express'
import { requireAuth } from '../../middleware/auth.ts'
import { deletePost, updatePost, uploadPost } from '../../controllers/postController.ts'
import { authed } from '../../utils/authed.ts'
import { imageUpload } from '../../middleware/imageUpload.ts'
import { POST_MAX_SIZE } from '../../constants/imageUpload.ts'

const router = express.Router()

router.delete('/:id',requireAuth, authed(deletePost))

router.patch('/:id',requireAuth, authed(updatePost))

router.post(
	'/',
	requireAuth,
	imageUpload('image', POST_MAX_SIZE),
	authed(uploadPost)
)

export default router
