import { Request, Response } from 'express'
import { matchedData } from 'express-validator'
import { HttpStatus } from '../../../core/types/http-statuses'
import { setDefaultSortAndPaginationIfNotExist } from '../../../core/utils/set-default-sort-and-pagination'
import { blogsService } from '../../service/blog.service'
import { SortDirection } from '../../../core/types/sort-direction'

export const getBlogsListHandler = async (req: Request, res: Response) => {
	const sanitizedQuery = matchedData(req, {
		locations: ['query'],
		includeOptionals: false,
	})

	const inputQuery = setDefaultSortAndPaginationIfNotExist(sanitizedQuery)

	console.log(inputQuery)

	const blogs = await blogsService.findMany({
		...inputQuery,
	})

	res.status(HttpStatus.Ok).send(blogs)
}
