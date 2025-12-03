import { Router } from 'express'
import { adminGuardMiddleware } from '../../core/middlewares/adminGuardMiddleware.middleware'
import { paginationAndSortingValidation } from '../../core/middlewares/query-pagination-sorting.validatiion-middleware'
import { idParamsValidator } from '../../core/middlewares/requiredId.middleWare'
import { searchTermValidation } from '../../core/middlewares/search-term-validation'
import { validation } from '../../core/middlewares/validatation.middleware'
import { blogBodyValidator } from '../blogBodyValidation'

import { iocContainer } from '../../core/composition.root'
import { postByByBlogBodyValidator } from '../../posts/validationPostByBlogBody'
import { BlogsController } from '../controller/blogs.controller'
import { setUserInfoFromBearerTokenMiddleware } from '../../core/middlewares/setUserInfoMiddleWare'

const blogsSortFields = {
	_id: '_id',
	createdAt: 'createdAt',
	name: 'name',
}

export const postsSortFields = {
	_id: '_id',
	createdAt: 'createdAt',
	title: 'title',
	blogName: 'blogName',
	blogId: 'blogId',
}

const blogsController = iocContainer.get<BlogsController>(BlogsController)

export const blogsRouter = Router({})
	.get(
		'',
		searchTermValidation('searchNameTerm'),
		paginationAndSortingValidation(blogsSortFields),
		validation,
		blogsController.getBlogsList
	)

	.get('/:id', blogsController.getBlogById)

	.post(
		'',
		adminGuardMiddleware,
		blogBodyValidator,
		validation,
		blogsController.addBlog
	)

	.put(
		'/:id',
		adminGuardMiddleware,
		idParamsValidator,
		blogBodyValidator,
		validation,
		blogsController.updateBlogById
	)

	.get(
		'/:id/posts',
		idParamsValidator,
		setUserInfoFromBearerTokenMiddleware,
		paginationAndSortingValidation(postsSortFields),
		validation,
		blogsController.getPostsByBlogId
	)

	.post(
		'/:id/posts',
		adminGuardMiddleware,
		idParamsValidator,
		postByByBlogBodyValidator,
		validation,
		blogsController.addPostsByBlogId
	)

	.delete(
		'/:id',
		adminGuardMiddleware,
		idParamsValidator,
		validation,
		blogsController.deleteBlogById
	)
