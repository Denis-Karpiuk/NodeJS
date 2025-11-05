import { Router } from 'express'

import { deleteCommentHandler } from './handlers/delete-comment-handler'
import { getCommentHandler } from './handlers/get-comment-handler'
import { updateCommentHandler } from './handlers/update-comment-handler'
import { idParamsValidator } from '../../core/middlewares/requiredId.middleWare'
import { commentBodyValidator } from '../commentBodyValidation'
import { validation } from '../../core/middlewares/validatation.middleware'
import { authBearerMiddleware } from '../../core/middlewares/authBearerMiddleWare'
import { ruleEditCommentValidation } from './rule-validation'

export const commentsRouter = Router({})
	.get('/:id', idParamsValidator, validation, getCommentHandler)

	.put(
		'/:id',
		authBearerMiddleware,
		ruleEditCommentValidation,
		commentBodyValidator,
		validation,
		updateCommentHandler
	)

	.delete(
		'/:id',
		authBearerMiddleware,
		ruleEditCommentValidation,
		validation,
		deleteCommentHandler
	)
