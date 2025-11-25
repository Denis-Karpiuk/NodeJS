import { Router } from 'express'
import { iocContainer } from '../../composition.root'
import { rateLimit } from '../../core/middlewares/rate.limit.middleware'
import { userBodyValidator } from '../../core/middlewares/userBodyValidator'
import { validation } from '../../core/middlewares/validatation.middleware'
import { validateConfirmationBody } from '../../core/middlewares/validateConfirmationBody'
import { validateEmail } from '../../core/middlewares/validateEmail'
import { authBodyValidator } from '../authBodyValidation'
import { AuthController } from '../controller/auth.controller'
import 'reflect-metadata'

const authController = iocContainer.get<AuthController>(AuthController)

export const authRouter = Router({})
	.get('/me', authController.me)
	.post(
		'/login',
		rateLimit(5),
		authBodyValidator,
		validation,
		authController.login
	)
	.post(
		'/registration',
		rateLimit(5),
		userBodyValidator,
		validation,
		authController.registration
	)
	.post(
		'/registration-confirmation',
		rateLimit(5),
		validateConfirmationBody,
		validation,
		authController.registrationConfirmation
	)
	.post(
		'/registration-email-resending',
		rateLimit(5),
		validateEmail,
		validation,
		authController.registrationEmailResending
	)
	.post('/logout', rateLimit(5), authController.logout)
	.post('/refresh-token', rateLimit(5), authController.refreshToken)
