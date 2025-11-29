import { Router } from 'express'
import { postsSortFields } from '../../blogs/router/blogs.router'
import { commentBodyValidator } from '../../comments/commentBodyValidation'
import { iocContainer } from '../../core/composition.root'
import { adminGuardMiddleware } from '../../core/middlewares/adminGuardMiddleware.middleware'
import { authBearerMiddleware } from '../../core/middlewares/authBearerMiddleWare'
import { paginationAndSortingValidation } from '../../core/middlewares/query-pagination-sorting.validatiion-middleware'
import { idParamsValidator } from '../../core/middlewares/requiredId.middleWare'
import { validation } from '../../core/middlewares/validatation.middleware'
import { PostController } from '../controller/post.controller'
import { postBodyValidator } from '../validation'

const postsController = iocContainer.get<PostController>(PostController)

export const postsRouter = Router({})
	.get(
		'',
		paginationAndSortingValidation(postsSortFields),
		validation,
		postsController.getPostsList
	)

	.get('/:id', postsController.getPostById)

	.post(
		'',
		adminGuardMiddleware,
		postBodyValidator,
		validation,
		postsController.addPost
	)

	.put(
		'/:id',
		adminGuardMiddleware,
		idParamsValidator,
		postBodyValidator,
		validation,
		postsController.updatePostById
	)

	.delete(
		'/:id',
		adminGuardMiddleware,
		idParamsValidator,
		validation,
		postsController.deletePostById
	)

	.post(
		'/:id/comments',
		authBearerMiddleware,
		commentBodyValidator,
		validation,
		postsController.addPostComment
	)

	.get(
		'/:id/comments',
		idParamsValidator,
		paginationAndSortingValidation({
			createdAt: 'createdAt',
		}),
		validation,
		postsController.getPostComments
	)
