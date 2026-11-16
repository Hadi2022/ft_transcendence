import express from 'express'
import { requireAuth } from '../../middleware/auth.ts'
import { deletePost } from '../../controllers/postController.ts'
import { authed } from '../../utils/authed.ts'

const router = express.Router()

router.delete('/:id',requireAuth, authed(deletePost))

export default router
