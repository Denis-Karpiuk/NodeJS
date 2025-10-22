import { Request, Response } from 'express'
import { matchedData } from 'express-validator'
import { HttpStatus } from '../../../core/types/http-statuses'
import { setDefaultSortAndPaginationIfNotExist } from '../../../core/utils/set-default-sort-and-pagination'
import { postsService } from '../../services/post-service'
import { SortDirection } from '../../../core/types/sort-direction'

export const getPostsListHandler = async (req: Request, res: Response) => {
	const sanitizedQuery = matchedData(req, {
		locations: ['query'],
		includeOptionals: false,
	})

	const inputQuery = setDefaultSortAndPaginationIfNotExist(sanitizedQuery)

	const posts = await postsService.findMany({
		...inputQuery,
	})

	res.status(HttpStatus.Ok).send(posts)
}
