import { Router } from 'express'
import { validation } from '../../core/middlewares/validatation.middleware'
import { authBodyValidator } from '../authBodyValidation'
import { loginHandler } from './handlers/loginHandler'

export const authRouter = Router({}).post(
	'/login',
	authBodyValidator,
	validation,
	loginHandler
)
