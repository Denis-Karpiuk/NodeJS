import { Request, Response } from 'express'
import { ResultStatus } from '../../../core/result/resultStatus'
import { resultCodeToHttpException } from '../../../core/result/resultStatusToHttpCode'
import { HttpStatus } from '../../../core/types/http-statuses'
import { commentService } from '../../services/comment.service'

export const updateCommentHandler = async (req: Request, res: Response) => {
	const id = req.params.id

	const result = await commentService.updateCommentById({
		id,
		...req.body,
	})

	if (result.status !== ResultStatus.Success) {
		return res
			.status(resultCodeToHttpException(result.status))
			.send({ errorsMessages: result.extensions })
	}

	res.status(HttpStatus.NoContent).send(result.data)
}
