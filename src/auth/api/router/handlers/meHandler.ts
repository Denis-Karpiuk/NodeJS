import { Request, Response } from 'express'
import { HttpStatus } from '../../../../core/types/http-statuses'
import { usersQueryRepository } from '../../../../users/infrastructure/users.query.repository'
import { jwtService } from '../../../service/jwtService'

export const meHandler = async (req: Request, res: Response) => {
	const authorization = req.headers.authorization
	const token = authorization?.split(' ')[1]

	if (!token) {
		return res.sendStatus(HttpStatus.Unauthorized)
	}

	let verifiedTokenInfo
	try {
		verifiedTokenInfo = await jwtService.verifyToken(token)
	} catch (err) {
		return res.sendStatus(HttpStatus.Unauthorized)
	}

	if (!verifiedTokenInfo) {
		return res.sendStatus(HttpStatus.Unauthorized)
	}

	const result = await usersQueryRepository.findUserById(
		verifiedTokenInfo.userId
	)

	if (!result) {
		return res.sendStatus(HttpStatus.Unauthorized)
	}

	const me = {
		email: result.email,
		login: result.login,
		userId: result.id,
	}

	return res.status(HttpStatus.Success).send(me)
}
