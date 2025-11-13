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

export const authRouter = Router({})
	.post('/login', authBodyValidator, validation, loginHandler)
	.get('/me', meHandler)
	.post('/registration', userBodyValidator, validation, registrationHandler)
	.post(
		'/registration-confirmation',
		validateConfirmationBody,
		validation,
		registrationConfirmationHandler
	)
	.post(
		'/registration-email-resending',
		validateEmail,
		validation,
		registrationEmailResendingHandler
	)
