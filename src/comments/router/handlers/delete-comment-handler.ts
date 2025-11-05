import { Request, Response } from 'express'
import { commentService } from '../../services/comment.service'
import { ResultStatus } from '../../../core/result/resultStatus'
import { resultCodeToHttpException } from '../../../core/result/resultStatusToHttpCode'
import { HttpStatus } from '../../../core/types/http-statuses'
import { commentQwRepository } from '../../repository/comment.query.repository'

export const deleteCommentHandler = async (req: Request, res: Response) => {
	const id = req.params.id

	if (!id) {
		return res.status(HttpStatus.NotFound).send({
			errorsMessages: ['Comment not found'],
		})
	}

	const user = req.context?.user

	const comment = await commentQwRepository.findById(id)

	if (comment.data?.commentatorInfo.userId !== user?.id) {
		return res.status(HttpStatus.Forbidden).send({
			errorsMessages: ['You are not allowed to update this comment'],
		})
	}

	const result = await commentService.deleteCommentById(id)

	if (result.status !== ResultStatus.Success) {
		console.log(resultCodeToHttpException(result.status), 'result.status')

		return res
			.status(resultCodeToHttpException(result.status))
			.send({ errorsMessages: result.extensions })
	}

	res.status(HttpStatus.NoContent).send(result.data)
}
