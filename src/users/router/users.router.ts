import { Router } from 'express'
import { addUserHandler } from './handlers/addUserHandler'
import { adminGuardMiddleware } from '../../core/middlewares/adminGuardMiddleware.middleware'
import { userBodyValidator } from './middlewares/userBodyValidator'
import { validation } from '../../core/middlewares/validatation.middleware'

export const usersRouter = Router({}).post(
	'',
	adminGuardMiddleware,
	userBodyValidator,
	validation,
	addUserHandler
)
