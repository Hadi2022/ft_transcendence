
import type { Request, Response } from 'express';

import * as sessionService from '../services/sessionService.ts'
import * as userService from '../services/userService.ts'

import * as sessionConstants from '../constants/session.ts'

export const openSession = async (req: Request, res: Response) => {

	if (req.session)
		throw new Error('Session already exists') // will be implemented with /types/errors.ts

	const {identifier, password} = req.body

	if (typeof identifier !== 'string' || typeof password !== 'string')
		throw new Error('Bad request') // new  BadRequest() / 400

	const user = await userService.isValidCredentials(identifier, password)

	if (!user)
		throw new Error('Invalid credentials') // will be new InvalidCredentials('Invalid credentials')

	const session = await sessionService.openSession(user.id)

	res.cookie(sessionConstants.COOKIE_NAME, session.token, {
		httpOnly: true,
		expires: session.expiresAt,
		path: '/'
		// Will add more later, currently just for production and testing
	})

	res.status(201).end()
}

export const listSessions = async (req: Request, res: Response) => {

	const sessions = await sessionService.findUserSessions(req.user.id)
	
	res.status(200).json(sessions.map((s) => ({ ...s, current: s.id === req.session.id })))
}

export const closeSession = async (req: Request, res: Response) => {

	if (typeof req.params.id !== 'string')
		throw new Error('Bad request') // new  BadRequest() / 400

	if (!await sessionService.closeUserSessionById(req.user.id, req.params.id))
		throw new Error('Not found') // new NotFound('Session does not exist')

	res.status(204).end();
}

export const closeCurrentSession = async (req: Request, res: Response) => {

	await sessionService.closeUserSessionById(req.session.user.id, req.session.id);

	res.clearCookie(sessionConstants.COOKIE_NAME, {
		httpOnly: true,
		path: '/'
	})

	res.status(204).end();
}

export const closeAllUserSessions = async (req: Request, res: Response) => {

	sessionService.closeAllUserSessions(req.user.id)

	res.clearCookie(sessionConstants.COOKIE_NAME, {
		httpOnly: true,
		path: '/'
	})

	res.status(204).end()
}