import { Request, Response } from 'express'
import { matchedData } from 'express-validator'
import { HttpStatus } from '../../../core/types/http-statuses'
import { setDefaultSortAndPaginationIfNotExist } from '../../../core/utils/set-default-sort-and-pagination'
import { BlogSearchParamsType, blogsService } from '../../service/blog.service'

export const getBlogsListHandler = async (req: Request, res: Response) => {
	const sanitizedQuery = matchedData(req, {
		locations: ['query'],
		includeOptionals: true,
	})

	const inputQuery = setDefaultSortAndPaginationIfNotExist(sanitizedQuery)

	const blogs = await blogsService.findMany(inputQuery as any)

	res.status(HttpStatus.Ok).send(blogs)
}
