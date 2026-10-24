
import * as sessionService from '../services/sessionService.ts'
import * as userService from '../services/userService.ts'

import * as sessionConstants from '../constants/session.ts'

import type { Request, Response } from 'express';

const openSession = async (req: Request, res: Response) => {

	// if (req.session)
		// throw new ConflictError('Session already exists') // will be implemented with /types/errors.ts

	const {username, password} = req.body

	const user = await userService.isValidCredentials(username, password) /* Somthing like this */

	const session = await sessionService.openSession(user.id)

	res.cookie(sessionConstants.COOKIE_NAME, session.token, {
		httpOnly: true,
		expires: session.expiresAt,
		// Will add more later, currently just for production and testing
	})

	res.status(201).json({
		"data": {
			"authenticated": true
		}
	})
}

const closeSession = async (req: Request, res: Response) => {

	await sessionService.closeSessionById(req.params.id);

	res.status(204).end();
}

const closeCurrentSession = async (req: Request, res: Response) => {

	const sessionID = req.session

	if (!sessionID)
	{
		res.status(204).end()
		return ;
	}

	await sessionService.closeSessionById(sessionID);

	res.status(204).end();
}

module.exports = {
	openSession,
	closeSession,
	closeCurrentSession,
}