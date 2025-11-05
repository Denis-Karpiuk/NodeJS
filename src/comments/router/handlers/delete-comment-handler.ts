import { Request, Response } from 'express'
import { commentService } from '../../services/comment.service'
import { ResultStatus } from '../../../core/result/resultStatus'
import { resultCodeToHttpException } from '../../../core/result/resultStatusToHttpCode'
import { HttpStatus } from '../../../core/types/http-statuses'
import { commentQwRepository } from '../../repository/comment.query.repository'

export const deleteCommentHandler = async (req: Request, res: Response) => {
	const id = req.params.id

	const result = await commentService.deleteCommentById(id)

	if (result.status !== ResultStatus.Success) {
		console.log(resultCodeToHttpException(result.status), 'result.status')

		return res
			.status(resultCodeToHttpException(result.status))
			.send({ errorsMessages: result.extensions })
	}

	res.status(HttpStatus.NoContent).send(result.data)
}
