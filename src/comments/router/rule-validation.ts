import { Request, Response, NextFunction } from 'express'
import { HttpStatus } from '../../core/types/http-statuses'
import { commentQwRepository } from '../repository/comment.query.repository'
import { createErrorMessages } from '../../core/utils/createError'
import { ResultStatus } from '../../core/result/resultStatus'

export const ruleEditCommentValidation = async (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	const id = req.params.id

	if (!id) {
		return res.status(HttpStatus.NotFound).send('Comment not found')
	}

	const user = req.context?.user

	const result = await commentQwRepository.findById(id)

	if (result.status === ResultStatus.NotFound) {
		return res.status(HttpStatus.NotFound).send('Comment not found')
	}

	if (result.data?.commentatorInfo.userId !== user?.id) {
		return res.status(HttpStatus.Forbidden).send('Access denied')
	}

	next()
}
