import { Router } from 'express'

import { iocContainer } from '../../core/composition.root'
import { authBearerMiddleware } from '../../core/middlewares/authBearerMiddleWare'
import { idParamsValidator } from '../../core/middlewares/requiredId.middleWare'
import { validation } from '../../core/middlewares/validatation.middleware'
import { commentBodyValidator } from '../commentBodyValidation'
import { CommentsController } from '../controller/comments.controller'
import { ruleEditCommentValidation } from './rule-validation'
import { likeCommentBodyValidator } from '../lkeCommentBody'
import { setUserInfoFromBearerTokenMiddleware } from '../../core/middlewares/setUserInfoMiddleWare'

const commentController =
	iocContainer.get<CommentsController>(CommentsController)

export const commentsRouter = Router({})
	.get(
		'/:id',
		idParamsValidator,
		validation,
		setUserInfoFromBearerTokenMiddleware,
		commentController.getComment
	)

	.put(
		'/:id',
		authBearerMiddleware,
		ruleEditCommentValidation,
		commentBodyValidator,
		validation,
		commentController.updateComment
	)

	.put(
		'/:id/like-status',
		authBearerMiddleware,
		likeCommentBodyValidator,
		validation,
		commentController.addLikeStatusToComment
	)

	.delete(
		'/:id',
		authBearerMiddleware,
		ruleEditCommentValidation,
		validation,
		commentController.deleteComment
	)
