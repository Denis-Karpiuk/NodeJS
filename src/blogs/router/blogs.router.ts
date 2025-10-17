import { Router, Request, Response } from 'express'
import { HttpStatus } from '../../core/types/http-statuses'
import { blogsRepository } from '../repository/blogs.mongo.repository'
import { adminGuardMiddleware } from '../../core/middlewares/adminGuardMiddleware.middleware'
import { validation } from '../../core/middlewares/validatation.middleware'
import { blogBodyValidator } from '../blogBodyValidation'
import { idParamsValidator } from '../../core/middlewares/requiredId.middleWare'

export const blogsRouter = Router({})
	.get('', async (_, res) => {
		res.status(HttpStatus.Ok).send(await blogsRepository.getBlogs())
	})

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
