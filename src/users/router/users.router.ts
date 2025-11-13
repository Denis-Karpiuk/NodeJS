import { Router } from 'express'
import { addUserHandler } from './handlers/addUserHandler'
import { adminGuardMiddleware } from '../../core/middlewares/adminGuardMiddleware.middleware'
import { validation } from '../../core/middlewares/validatation.middleware'
import { paginationAndSortingValidation } from '../../core/middlewares/query-pagination-sorting.validatiion-middleware'
import { getAllUserHandler } from './handlers/getAllUserHandler'
import { searchTermValidation } from '../../core/middlewares/search-term-validation'
import { idParamsValidator } from '../../core/middlewares/requiredId.middleWare'
import { deleteUserHandler } from './handlers/deleteUserHandler'
import { userBodyValidator } from '../../core/middlewares/userBodyValidator'

const usersSortFields = {
	createdAt: 'createdAt',
	login: 'login',
}

export const usersRouter = Router({})
	.get(
		'',
		adminGuardMiddleware,
		searchTermValidation('searchLoginTerm'),
		searchTermValidation('searchEmailTerm'),
		paginationAndSortingValidation(usersSortFields),
		validation,
		getAllUserHandler
	)

	.post(
		'',
		adminGuardMiddleware,
		userBodyValidator,
		validation,
		addUserHandler
	)

	.delete(
		'/:id',
		adminGuardMiddleware,
		idParamsValidator,
		validation,
		deleteUserHandler
	)
