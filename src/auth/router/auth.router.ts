import { Request, Router, Response } from 'express'
import { authService } from '../service/auth.service'
import { HttpStatus } from '../../core/types/http-statuses'
import { validation } from '../../core/middlewares/validatation.middleware'
import { authBodyValidator } from '../authBodyValidation'

export const authRouter = Router({}).post(
	'/login',
	authBodyValidator,
	validation,
	async (req: Request, res: Response) => {
		const result = await authService.login(req.body)

		if (!result.success) {
			res.status(HttpStatus.Unauthorized).send({
				errorMessages: [result.error],
			})
			return
		}

		res.status(HttpStatus.NoContent).send(result)
	}
)
