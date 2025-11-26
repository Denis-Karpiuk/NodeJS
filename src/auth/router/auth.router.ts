import { Router } from 'express'
import { iocContainer } from '../../core/composition.root'
import { newPasswordValidator } from '../../core/middlewares/newPasswordValidator'
import { rateLimit } from '../../core/middlewares/rate.limit.middleware'
import { userBodyValidator } from '../../core/middlewares/userBodyValidator'
import { validation } from '../../core/middlewares/validatation.middleware'
import { validateConfirmationBody } from '../../core/middlewares/validateConfirmationBody'
import { validateEmail } from '../../core/middlewares/validateEmail'
import { validateEmailRecovery } from '../../core/middlewares/validateEmailRecovery'
import { authBodyValidator } from '../authBodyValidation'
import { AuthController } from '../controller/auth.controller'

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
	.post(
		'/password-recovery',
		validateEmailRecovery,
		validation,
		rateLimit(5),
		authController.passwordRecovery
	)
	.post(
		'/new-password',
		newPasswordValidator,
		validation,
		rateLimit(5),
		authController.createNewPassword
	)
