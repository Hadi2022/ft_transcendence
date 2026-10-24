import type { Request, Response } from 'express'
import express from 'express'

const router = express.Router()

router.get('/', (_req: Request, res: Response) => {
    res.status(200).json({
        data: {
            status: 'ok'
        }
    })
})

export default router
