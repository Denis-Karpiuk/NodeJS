import { NextFunction, Request, Response } from 'express'
import { securityService } from '../../security/service/security.service'
import { HttpStatus } from '../types/http-statuses'

export const rateLimit =
	(maxRequestsCount: number) =>
	async (req: Request, res: Response, next: NextFunction) => {
		const ipAddress =
			req.headers['x-forwarded-for'] || req.socket.remoteAddress
		const url = req.url || req.originalUrl

		let totalRequestsCountResult = 0

		if (typeof ipAddress === 'string' && typeof url === 'string') {
			await securityService.addRequestToRequestsList({
				ip: ipAddress,
				url,
			})

			totalRequestsCountResult =
				await securityService.getAllRequestsCount({
					ip: ipAddress,
					url,
				})
		}

		if (totalRequestsCountResult > maxRequestsCount) {
			return res.sendStatus(HttpStatus.TooManyRequests)
		}

		next()
	}
