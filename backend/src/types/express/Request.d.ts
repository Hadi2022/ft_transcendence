import "express"
import type { Request } from "express"
import type { Session, User } from '@prisma/client'

declare global {
  namespace Express {
    interface Request {
      session?: Session
      user?: User
    }
  }
}

export interface AuthenticatedRequest extends Request {
  session: Session,
  user: User,
}

export {}