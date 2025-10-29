import { Request, Response } from 'express'
import { HttpStatus } from '../../../core/types/http-statuses'
import { usersService } from '../../service/users.service'

export const deleteUserHandler = async (req: Request, res: Response) => {
	const { id } = req.params

	const result = await usersService.deleteUser(id)

	if (!result) {
		return res.status(HttpStatus.NotFound).send('User not found')
	}

	return res
		.status(HttpStatus.NoContent)
		.send(`User with id ${id} was deleted`)
}
