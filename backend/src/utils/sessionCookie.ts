import type { Response } from 'express'
import * as sessionConstants from '../constants/session.ts'

export function setSessionCookie(
  res: Response,
  session: { token: string; expiresAt: Date }
): void {
  res.cookie(sessionConstants.COOKIE_NAME, session.token, {
    httpOnly: true,
    expires: session.expiresAt,
    path: '/',
  })
}

export function clearSessionCookie(res: Response): void {
  res.clearCookie(sessionConstants.COOKIE_NAME, {
    httpOnly: true,
    path: '/',
  })
}
