import express from 'express'
import {
  authorizeGoogle,
  googleCallback,
} from '../../controllers/googleOAuthController.ts'

const router = express.Router()

router.get('/', authorizeGoogle)
router.get('/callback', googleCallback)

export default router