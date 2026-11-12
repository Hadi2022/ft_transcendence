import express from 'express'
import { requireAuth } from '../../middleware/auth.ts'
import { getPostById } from '../../repositories/postRepository.ts'

const router = express.Router()

router.delete('/:id',requireAuth,getPostById)
