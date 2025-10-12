import { Router } from 'express'
import { HttpStatus } from '../../core/types/http-statuses'
import { postsRepository } from '../repository/posts.repository'
import { adminGuardMiddleware } from '../../core/middlewares/adminGuardMiddleware.middleware'

export const postsRouter = Router({})
	.get('', (_, res) => {
		res.status(HttpStatus.Ok).send(postsRepository.getPosts())
	})

	.get('/:id', (req, res) => {
		const post = postsRepository.getPostById(+req.params.id)
		if (!post) {
			res.status(HttpStatus.NotFound).send('Post not found')
		}

		res.status(HttpStatus.Ok).send(post)
	})

	.post('', adminGuardMiddleware, (req, res) => {
		const result = postsRepository.addPost(req.body)

		if (!result) {
			res.status(HttpStatus.NotFound).send('Blog not found')
		}

		res.status(HttpStatus.Created).send(result)
	})

	.put('/:id', adminGuardMiddleware, (req, res) => {
		const updateResult = postsRepository.updatePost({
			...req.body,
			id: +req.params.id,
		})

		if (!updateResult) {
			res.status(HttpStatus.NotFound).send('Post not found')
		}

		res.status(HttpStatus.NoContent).send(
			`Post ${req.params.id} was updated successfully`
		)
	})

	.delete('/:id', adminGuardMiddleware, (req, res) => {
		const result = postsRepository.deletePostById(+req.params.id)

		if (!result) {
			res.status(HttpStatus.NotFound).send('Post not found')
		}

		res.status(HttpStatus.NoContent).send(
			`Post ${+req.params.id} was deleted`
		)
	})
