import "express"
import type { Request } from "express"
import type { Session } from '@prisma/client'
import type { UserProfile, User } from '../../user.ts'

declare global {
  namespace Express {
    interface Request {
      session?: Session
      user?: User
	    userResource?: UserProfile
    }
  }
}

export interface AuthenticatedRequest extends Request {
  session: Session,
  user: User,
}

export {}