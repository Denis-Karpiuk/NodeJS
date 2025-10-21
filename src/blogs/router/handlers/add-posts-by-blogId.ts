import { Request, Response } from 'express'
import { HttpStatus } from '../../../core/types/http-statuses'
import { postsService } from '../../../posts/services/post-service'
import { blogsRepository } from '../../repository/blogs.mongo.repository'

export const addPostsByBlogId = async (req: Request, res: Response) => {
	const blogId = req.params.id

	const blog = await blogsRepository.getBlogById(req.params.id)

	if (!blog) {
		res.status(HttpStatus.NotFound).send('Blog not found')
		return
	}

	const result = await postsService.createPost({ ...req.body, blogId })

	if (!result) {
		res.status(HttpStatus.NotFound).send('Blog not found')
	}

	res.status(HttpStatus.Created).send(result)
}
