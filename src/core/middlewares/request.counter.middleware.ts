import { NextFunction, Request, Response } from 'express'
import { secureService } from '../../secure/service/secure.service'

export const requestCounterMiddleware = async (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	const ipAddress = req.headers['x-forwarded-for'] || req.socket.remoteAddress
	const url = req.url || req.originalUrl

	let totalRequestsCountResult = 0

	if (typeof ipAddress === 'string' && typeof url === 'string') {
		await secureService.addRequestToRequestsList({
			IP: ipAddress,
			URL: url,
		})

		totalRequestsCountResult = await secureService.getAllRequestsCount({
			IP: ipAddress,
			URL: url,
		})
	}

	// if (totalRequestsCountResult > 50) {
	// 	return res.status(429).send('Too many requests')
	// }

	next()
}
