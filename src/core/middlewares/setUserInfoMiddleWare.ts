import { NextFunction, Request, Response } from 'express'
import { HttpStatus } from '../types/http-statuses'
import { jwtService } from '../../auth/service/jwtService'

export const ADMIN_USERNAME = process.env.ADMIN_USERNAME || 'admin'
export const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'qwerty'

export const setUserInfoFromBearerTokenMiddleware = async (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	const auth = req.get('authorization') || req.headers['authorization']

	let token = ''

	if (auth) {
		const [_, bearerToken] = auth.split(' ')
		token = bearerToken
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
		next()
		req.context = { user: { id: '', login: '' } }
	}
}
