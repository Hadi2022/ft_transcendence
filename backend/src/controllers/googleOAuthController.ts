import { randomBytes, timingSafeEqual } from 'node:crypto'
import type { Request, Response } from 'express'

import {
  getGoogleAuthorizationUrl,
  verifyGoogleAuthorizationCode,
} from '../services/googleOAuthService.ts'

const STATE_COOKIE = 'google_oauth_state'
const STATE_MAX_AGE = 10 * 60 * 1000

const cookieOptions = {
  httpOnly: true,
  secure: true,
  sameSite: 'lax' as const,
  path: '/api/auth/google',
}

export function authorizeGoogle(_req: Request, res: Response) {
  const state = randomBytes(32).toString('hex')

  res.cookie(STATE_COOKIE, state, {
    ...cookieOptions,
    maxAge: STATE_MAX_AGE,
  })

  res.redirect(getGoogleAuthorizationUrl(state))
}

export async function googleCallback(req: Request, res: Response) {
  const storedState = req.cookies[STATE_COOKIE]

  res.clearCookie(STATE_COOKIE, cookieOptions)

  const state = req.query.state
  const code = req.query.code

  if (
    typeof storedState !== 'string' ||
    typeof state !== 'string' ||
    !/^[a-f0-9]{64}$/.test(storedState) ||
    !/^[a-f0-9]{64}$/.test(state) ||
    !timingSafeEqual(
      Buffer.from(storedState, 'hex'),
      Buffer.from(state, 'hex')
    )
  ) {
    res.status(400).json({
      error: {
        code: 'INVALID_OAUTH_STATE',
        message: 'Invalid or missing OAuth state',
      },
    })
    return
  }

  if (req.query.error) {
    res.status(400).json({
      error: {
        code: 'GOOGLE_AUTHORIZATION_DENIED',
        message: 'Google authorization was not completed',
      },
    })
    return
  }

  if (typeof code !== 'string' || !code) {
    res.status(400).json({
      error: {
        code: 'MISSING_AUTHORIZATION_CODE',
        message: 'Missing Google authorization code',
      },
    })
    return
  }

  try {
    await verifyGoogleAuthorizationCode(code)

    // Temporary response until user/session integration is implemented.
    res.status(200).json({
      success: true,
      message: 'Google identity verified successfully',
    })
  } catch {
    res.status(401).json({
      error: {
        code: 'GOOGLE_AUTHENTICATION_FAILED',
        message: 'Google authentication could not be completed',
      },
    })
  }
}