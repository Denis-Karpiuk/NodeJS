import { Router, Response, Request } from 'express'
import { HttpStatus } from '../../core/types/http-statuses'
import { postsRepository } from '../repository/posts.repository'
import { adminGuardMiddleware } from '../../core/middlewares/adminGuardMiddleware.middleware'
import { postBodyValidator } from '../validation'
import { validation } from '../../core/middlewares/validatation.middleware'
import { idParamsValidator } from '../../core/middlewares/requiredId.middleWare'
import { getPostsListHandler } from './handlers/get-blogs-list-handler'
import { paginationAndSortingValidation } from '../../core/middlewares/query-pagination-sorting.validatiion-middleware'
import { postsSortFields } from '../../blogs/router/blogs.router'

export const postsRouter = Router({})
	.get(
		'',
		paginationAndSortingValidation(postsSortFields),
		validation,
		getPostsListHandler
	)

	.get('/:id', async (req, res) => {
		const post = await postsRepository.getPostById(req.params.id)
		if (!post) {
			res.status(HttpStatus.NotFound).send('Post not found')
		}

		res.status(HttpStatus.Success).send(post)
	})

	.post(
		'',
		adminGuardMiddleware,
		postBodyValidator,
		validation,
		async (req: Request, res: Response) => {
			const result = await postsRepository.addPost(req.body)

			if (!result) {
				res.status(HttpStatus.NotFound).send('Blog not found')
			}

			res.status(HttpStatus.Created).send(result)
		}
	)

	.put(
		'/:id',
		adminGuardMiddleware,
		idParamsValidator,
		postBodyValidator,
		validation,
		async (req: Request, res: Response) => {
			const updateResult = await postsRepository.updatePost({
				...req.body,
				id: req.params.id,
			})

			if (!updateResult) {
				res.status(HttpStatus.NotFound).send('Post not found')
			}

			res.status(HttpStatus.NoContent).send(
				`Post ${req.params.id} was updated successfully`
			)
		}
	)

	.delete(
		'/:id',
		adminGuardMiddleware,
		idParamsValidator,
		validation,
		async (req: Request, res: Response) => {
			const result = await postsRepository.deletePostById(req.params.id)

			if (!result) {
				res.status(HttpStatus.NotFound).send('Post not found')
			}

			res.status(HttpStatus.NoContent).send(
				`Post ${req.params.id} was deleted`
			)
		}
	)
