import { Router } from 'express'
import { getCommentHandler } from './handlers/get-comment-handler'
import { idParamsValidator } from '../../../core/middlewares/requiredId.middleWare'
import { validation } from '../../../core/middlewares/validatation.middleware'
import { updateCommentHandler } from './handlers/update-comment-handler'
import { deleteCommentHandler } from './handlers/delete-comment-handler'
import { commentBodyValidator } from '../../commentBodyValidation'
import { authBearerMiddleware } from '../../../core/middlewares/authBearerMiddleWare'

export const commentsRouter = Router({})
	.get('/:id', idParamsValidator, validation, getCommentHandler)

	.put(
		'/:id',
		authBearerMiddleware,
		idParamsValidator,
		commentBodyValidator,
		validation,
		updateCommentHandler
	)

	.delete(
		'/:id',
		authBearerMiddleware,
		idParamsValidator,
		validation,
		deleteCommentHandler
	)
