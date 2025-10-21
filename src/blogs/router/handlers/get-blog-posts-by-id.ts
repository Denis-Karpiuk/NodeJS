import { Request, Response } from 'express'
import { matchedData } from 'express-validator'
import { HttpStatus } from '../../../core/types/http-statuses'
import { setDefaultSortAndPaginationIfNotExist } from '../../../core/utils/set-default-sort-and-pagination'
import { postsService } from '../../../posts/services/post-service'
import { blogsRepository } from '../../repository/blogs.mongo.repository'

export const getPostsByBlogIdHandler = async (req: Request, res: Response) => {
	const sanitizedQuery = matchedData(req, {
		locations: ['query'],
		includeOptionals: false,
	})

	const blogId = req.params.id

	const blog = await blogsRepository.getBlogById(blogId)

	if (!blog) {
		res.status(HttpStatus.NotFound).send('Blog not found')
		return
	}

	const inputQuery = setDefaultSortAndPaginationIfNotExist(sanitizedQuery)

	const posts = await postsService.findMany({
		...inputQuery,
		blogId,
	})

	if (!posts) {
		res.status(HttpStatus.NotFound).send('Blog not found')
	}

	res.status(HttpStatus.Ok).send(posts)
}
