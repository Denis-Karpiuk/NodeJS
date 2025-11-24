import { NextFunction, Request, Response } from 'express'
import { HttpStatus } from '../types/http-statuses'
import { jwtService } from '../../auth/service/jwtService'

export const ADMIN_USERNAME = process.env.ADMIN_USERNAME || 'admin'
export const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'qwerty'

export const authBearerMiddleware = async (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	const auth = req.headers['authorization']

	if (!auth) {
		res.sendStatus(HttpStatus.Unauthorized)
		return
	}

	const [_, token] = auth.split(' ')

	if (!token) {
		return res.sendStatus(HttpStatus.Unauthorized)
	}

	try {
		const tokenInfo = await jwtService.verifyToken(token)

		req.context = {
			user: {
				id: tokenInfo.userId,
				login: tokenInfo.login,
			},
		}

		next()
	} catch (err) {
		return res.sendStatus(HttpStatus.Unauthorized)
	}
}
