import { Router } from 'express'
import { validation } from '../../../core/middlewares/validatation.middleware'
import { authBodyValidator } from '../../authBodyValidation'
import { loginHandler } from './handlers/loginHandler'
import { meHandler } from './handlers/meHandler'
import { registrationHandler } from './handlers/registrationHandler'
import { userBodyValidator } from '../../../core/middlewares/userBodyValidator'
import { registrationConfirmationHandler } from './handlers/registrationConfirmationHandler'
import { validateConfirmationBody } from '../../../core/middlewares/validateConfirmationBody'
import { registrationEmailResendingHandler } from './handlers/registrationEmailResendingHandler'
import { validateEmail } from '../../../core/middlewares/validateEmail'
import { logoutHandler } from './handlers/logoutHandler'
import { refreshTokenHandler } from './handlers/refreshTokenHandler'
import { rateLimit } from '../../../core/middlewares/rate.limit.middleware'

export const authRouter = Router({})
	.get('/me', meHandler)
	.post('/login', authBodyValidator, validation, rateLimit(5), loginHandler)
	.post(
		'/registration',
		userBodyValidator,
		validation,
		rateLimit(5),
		registrationHandler
	)
	.post(
		'/registration-confirmation',
		validateConfirmationBody,
		validation,
		rateLimit(5),
		registrationConfirmationHandler
	)
	.post(
		'/registration-email-resending',
		validateEmail,
		validation,
		rateLimit(5),
		registrationEmailResendingHandler
	)
	.post('/logout', rateLimit(5), logoutHandler)
	.post('/refresh-token', rateLimit(5), refreshTokenHandler)
