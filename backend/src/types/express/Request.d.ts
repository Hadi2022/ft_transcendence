import "express"
import type { Request } from "express"
import type { Session, User } from '@prisma/client'
import type { UserProfile } from '../../user.ts'

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