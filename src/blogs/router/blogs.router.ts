import { Request, Response, Router } from 'express'
import { adminGuardMiddleware } from '../../core/middlewares/adminGuardMiddleware.middleware'
import { idParamsValidator } from '../../core/middlewares/requiredId.middleWare'
import { validation } from '../../core/middlewares/validatation.middleware'
import { HttpStatus } from '../../core/types/http-statuses'
import { blogBodyValidator } from '../blogBodyValidation'
import { blogsRepository } from '../repository/blogs.mongo.repository'
import { paginationAndSortingValidation } from '../../core/middlewares/query-pagination-sorting.validatiion-middleware'
import { getBlogsListHandler } from './handlers/get-blogs-list-handler'
import { searchTermValidation } from '../../core/middlewares/search-term-validation'

const blogsSortFields = {
	createdAt: 'createdAt',
	name: 'name',
}

export const blogsRouter = Router({})
	.get(
		'',
		searchTermValidation('searchNameTerm'),
		paginationAndSortingValidation(blogsSortFields),
		validation,
		getBlogsListHandler
	)

	.get('/:id', async (req, res) => {
		const blog = await blogsRepository.getBlogById(req.params.id)

		if (!blog) {
			res.status(HttpStatus.NotFound).send('Blog not found')
		}

		res.status(HttpStatus.Ok).send(blog)
	})

	.post(
		'',
		adminGuardMiddleware,
		blogBodyValidator,
		validation,
		async (req: Request, res: Response) => {
			const result = await blogsRepository.addBlog(req.body)

			res.status(HttpStatus.Created).send(result)
		}
	)

	.put(
		'/:id',
		adminGuardMiddleware,
		idParamsValidator,
		blogBodyValidator,
		validation,
		async (req: Request, res: Response) => {
			const updateResult = await blogsRepository.updateBlog({
				...req.body,
				id: req.params.id,
			})

			if (!updateResult) {
				res.status(HttpStatus.NotFound).send('Blog not found')
			}

			res.status(HttpStatus.NoContent).send(
				`Blog ${req.params.id} was updated successfully`
			)
		}
	)

	.delete(
		'/:id',
		adminGuardMiddleware,
		idParamsValidator,
		validation,
		async (req: Request, res: Response) => {
			const result = await blogsRepository.deleteBlogById(req.params.id)

			if (!result) {
				res.status(HttpStatus.NotFound).send('Blog not found')
			}

			res.status(HttpStatus.NoContent).send(
				`Blog ${req.params.id} was deleted`
			)
		}
	)

	.get(
		'/:id/posts',
		idParamsValidator,
		validation,
		async (req: Request, res: Response) => {
			res.status(HttpStatus.Ok).send('result')
		}
	)

	.post('/:id/posts', async (req: Request, res: Response) => {
		res.status(HttpStatus.Created).send('result')
	})
