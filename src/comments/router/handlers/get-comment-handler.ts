import { Request, Response } from 'express'
import { commentQwRepository } from '../../repository/comment.query.repository'
import { ResultStatus } from '../../../core/result/resultStatus'
import { resultCodeToHttpException } from '../../../core/result/resultStatusToHttpCode'
import { HttpStatus } from '../../../core/types/http-statuses'

export const getCommentHandler = async (req: Request, res: Response) => {
	const id = req.params.id

	const result = await commentQwRepository.findById(id)

	if (result.status !== ResultStatus.Success) {
		return res
			.status(resultCodeToHttpException(result.status))
			.send({ errorsMessages: result.extensions })
	}

	res.status(HttpStatus.Success).send(result.data)
}
