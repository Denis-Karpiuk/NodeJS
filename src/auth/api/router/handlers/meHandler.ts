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

	const tokenInfo = await jwtService.decodeToken(token)

	if (!tokenInfo) {
		return res.sendStatus(HttpStatus.Unauthorized)
	}

	const result = await usersQueryRepository.findUserById(tokenInfo.userId)

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
