import "express"
import type { Session } from '@prisma/client'
import type { User } from '../../user.ts'

declare global {
  namespace Express {
    interface Request {
      session?: Session
      user?: User
    }
  }
}

export {}