import "express";
import type { Session, User } from '@prisma/client'

declare global {
  namespace Express {
    interface Request {
      session?: Session
      user?: User
    }
  }
}

export {};