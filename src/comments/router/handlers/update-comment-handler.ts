import { Request, Response } from 'express'
import { HttpStatus } from '../../../core/types/http-statuses'
import { commentService } from '../../services/comment.service'
import { ResultStatus } from '../../../core/result/resultStatus'
import { resultCodeToHttpException } from '../../../core/result/resultStatusToHttpCode'
import { commentQwRepository } from '../../repository/comment.query.repository'

export const updateCommentHandler = async (req: Request, res: Response) => {
	const id = req.params.id

	const user = req.context?.user

	const comment = await commentQwRepository.findById(id)

	if (comment.data?.commentatorInfo.userId !== user?.id) {
		return res.status(HttpStatus.Forbidden).send({
			errorsMessages: ['You are not allowed to update this comment'],
		})
	}

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
