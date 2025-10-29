import { Request, Router, Response } from 'express'
import { authService } from '../service/auth.service'
import { HttpStatus } from '../../core/types/http-statuses'
import { adminGuardMiddleware } from '../../core/middlewares/adminGuardMiddleware.middleware'
import { validation } from '../../core/middlewares/validatation.middleware'
import { authBodyValidator } from '../authBodyValidation'

export const authRouter = Router({}).post(
	'/login',
	adminGuardMiddleware,
	authBodyValidator,
	validation,
	async (req: Request, res: Response) => {
		const result = await authService.login(req.body)

		if (!result.success) {
			res.status(HttpStatus.Unauthorized).send({
				errorMessages: [result.error],
			})
		}

		res.status(HttpStatus.NoContent)
	}
)
