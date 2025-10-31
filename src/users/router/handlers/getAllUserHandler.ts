import { Request, Response } from 'express'
import { matchedData } from 'express-validator'
import { HttpStatus } from '../../../core/types/http-statuses'
import { setDefaultSortAndPaginationIfNotExist } from '../../../core/utils/set-default-sort-and-pagination'
import { usersQueryRepository } from '../../infrastructure/users.query.repository'

export const getAllUserHandler = async (req: Request, res: Response) => {
	const sanitizedQuery = matchedData(req, {
		locations: ['query'],
		includeOptionals: true,
	})

	const inputQuery = setDefaultSortAndPaginationIfNotExist(sanitizedQuery)

	const users = await usersQueryRepository.findAllUsers({
		...inputQuery,
		searchLoginTerm: sanitizedQuery.searchLoginTerm,
		searchEmailTerm: sanitizedQuery.searchEmailTerm,
	})

	return res.status(HttpStatus.Success).send(users)
}
