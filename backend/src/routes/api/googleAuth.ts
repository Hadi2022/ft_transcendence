import express from 'express'
import {
    authorizeGoogle,
    googleCallback,
} from '../../controllers/googleOAuthController.ts'
import { googleOAuthErrorHandler } from '../../middleware/googleOAuthErrorHandler.ts'

const router = express.Router()

router.get('/', authorizeGoogle)
router.get('/callback', googleCallback)

router.use(googleOAuthErrorHandler)

export default router