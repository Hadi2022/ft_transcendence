
const argon2 = require('argon2')

const sessionService = require('../services/sessionService')
const userService = require('../services/userService')

const openSession = async (req, res) => {

	if (req.user)
	{
		// 409 conflict
	}

	const {username, password} = req.body

	const user = await userService.isValidCredentials(username, password) /* Somthing like this */

	const authcookie = await sessionService.generateSession(user)

	res.cookie('auth', authcookie._id, {
		httpOnly: true,
	})

	res.status(201).json({
		"data": {
			"authenticated": true
		}
	})
}

const closeSession = (req, res) => {

	if (!req.cookies.session)
	{
		res.status(204).end()
		return ;
	}

	sessionService.removeSession(req.cookies.session.id);

	res.status(204).end();
}

module.exports = {
	openSession,
	closeSession
}