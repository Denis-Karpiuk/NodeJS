import { Router } from 'express'
import { HttpStatus } from '../../core/types/http-statuses'
import { blogsRepository } from '../repository/blogs.repository'
import { adminGuardMiddleware } from '../../core/middlewares/adminGuardMiddleware.middleware'

export const blogsRouter = Router({})
	.get('', (_, res) => {
		res.status(HttpStatus.Ok).send(blogsRepository.getBlogs())
	})

	.get('/:id', (req, res) => {
		const blog = blogsRepository.getBlogById(+req.params.id)
		if (!blog) {
			res.status(HttpStatus.NotFound).send('Blog not found')
		}

		res.status(HttpStatus.Ok).send(
			blogsRepository.getBlogById(+req.params.id)
		)
	})

	.post('', adminGuardMiddleware, (req, res) => {
		const result = blogsRepository.addBlog(req.body)

		res.status(HttpStatus.Created).send(result)
	})

	.put('/:id', adminGuardMiddleware, (req, res) => {
		const updateResult = blogsRepository.updateBlog({
			...req.body,
			id: +req.params.id,
		})

		if (!updateResult) {
			res.status(HttpStatus.NotFound).send('Blog not found')
		}

		res.status(HttpStatus.NoContent).send(
			`Blog ${req.params.id} was updated successfully`
		)
	})

	.delete('/:id', adminGuardMiddleware, (req, res) => {
		const result = blogsRepository.deleteBlogById(+req.params.id)

		if (!result) {
			res.status(HttpStatus.NotFound).send('Blog not found')
		}

		res.status(HttpStatus.NoContent).send(
			`Blog ${+req.params.id} was deleted`
		)
	})
