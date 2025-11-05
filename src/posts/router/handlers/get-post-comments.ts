import { Request, Response } from 'express'
import { matchedData } from 'express-validator'
import { commentQwRepository } from '../../../comments/repository/comment.query.repository'
import { HttpStatus } from '../../../core/types/http-statuses'
import { setDefaultSortAndPaginationIfNotExist } from '../../../core/utils/set-default-sort-and-pagination'
import { ResultStatus } from '../../../core/result/resultStatus'
import { resultCodeToHttpException } from '../../../core/result/resultStatusToHttpCode'

export const getPostCommentsHandler = async (req: Request, res: Response) => {
	const sanitizedQuery = matchedData(req, {
		locations: ['query'],
		includeOptionals: true,
	})

	const inputQuery = setDefaultSortAndPaginationIfNotExist(sanitizedQuery)

	const comments = await commentQwRepository.findMany({
		...inputQuery,
		postId: req.params.id,
	})

	if (comments.status !== ResultStatus.Success) {
		return res
			.status(resultCodeToHttpException(comments.status))
			.send({ errorsMessages: comments.extensions })
	}

	res.status(HttpStatus.Success).send(comments.data)
}
