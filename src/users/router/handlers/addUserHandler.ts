import { Request, Response } from 'express'
import { HttpStatus } from '../../../core/types/http-statuses'
import { usersQueryRepository } from '../../infrastructure/users.query.repository'
import { usersService } from '../../service/users.service'

export const addUserHandler = async (req: Request, res: Response) => {
	const { email, login, password } = req.body

	const result = await usersService.createUser({ email, login, password })

	if (result.error) {
		return res.status(HttpStatus.NotFound).send({
			errorsMessages: [result.error],
		})
	}

	const newUser = await usersQueryRepository.findUserById(result.id!)

	return res.status(HttpStatus.Created).send(newUser)
}
