
import * as cookie from 'cookie-es'
import type { Request, Response, NextFunction } from 'express'

export const parseCookies = (req: Request, _res: Response, next: NextFunction) => {
	req.cookies = cookie.parse(req.headers.cookie ?? '')
	next()
}

export default parseCookies