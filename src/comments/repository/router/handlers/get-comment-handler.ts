import { Request, Response } from 'express'
import { HttpStatus } from '../../../../core/types/http-statuses'
import { commentQwRepository } from '../../comment.query.repository'
import { resultCodeToHttpException } from '../../../../core/result/resultStatusToHttpCode'
import { ResultStatus } from '../../../../core/result/resultStatus'

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
