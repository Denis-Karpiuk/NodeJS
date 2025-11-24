import { NextFunction, Request, Response } from 'express'
import { HttpStatus } from '../types/http-statuses'
import { jwtService } from '../../auth/service/jwtService'

export const authRefreshTokenMiddleware = async (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	const token = req.cookies.refreshToken

	if (!token) {
		return res.sendStatus(HttpStatus.Unauthorized)
	}

	try {
		const tokenInfo = await jwtService.decodeToken(token)

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
