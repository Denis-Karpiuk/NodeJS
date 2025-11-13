import { Router } from 'express'
import { validation } from '../../../core/middlewares/validatation.middleware'
import { authBodyValidator } from '../../authBodyValidation'
import { loginHandler } from './handlers/loginHandler'
import { meHandler } from './handlers/meHandler'
import { registrationHandler } from './handlers/registrationHandler'
import { userBodyValidator } from '../../../core/middlewares/userBodyValidator'

export const authRouter = Router({})
	.post('/login', authBodyValidator, validation, loginHandler)
	.get('/me', meHandler)
	.post('/registration', userBodyValidator, validation, registrationHandler)
