import { Router } from 'express'
import { authService } from '../service/auth.service'
import { HttpStatus } from '../../core/types/http-statuses'

export const authRouter = Router({}).post('/login', async (req, res) => {
	const result = await authService.login(req.body)

	if (!result.success) {
		res.status(HttpStatus.Unauthorized).send({
			errorMessages: [result.error],
		})
	}

	res.status(HttpStatus.NotFound)
})
