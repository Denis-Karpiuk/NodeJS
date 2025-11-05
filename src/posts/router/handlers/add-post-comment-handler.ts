import { Request, Response } from 'express'
import { commentQwRepository } from '../../../comments/repository/comment.query.repository'
import { commentService } from '../../../comments/services/comment.service'
import { ResultStatus } from '../../../core/result/resultStatus'
import { resultCodeToHttpException } from '../../../core/result/resultStatusToHttpCode'
import { HttpStatus } from '../../../core/types/http-statuses'

export const addPostCommentHandler = async (req: Request, res: Response) => {
	const user = req.context!.user!

	const commentDto = {
		postId: req.params.id,
		content: req.body.content,
		commentatorInfo: {
			userId: user.id,
			userLogin: user?.login,
		},
	}

	const result = await commentService.addCommentByPostId(commentDto)

	if (result.status === ResultStatus.NotFound) {
		return res.status(HttpStatus.NotFound).send('Post not found')
	}

	if (result.status !== ResultStatus.Success) {
		return res
			.status(resultCodeToHttpException(result.status))
			.send({ errorsMessages: result.extensions })
	}

	const comment = await commentQwRepository.findById(result.data!)

	if (comment.status !== ResultStatus.Success) {
		return res
			.status(resultCodeToHttpException(comment.status))
			.send({ errorsMessages: comment.extensions })
	}

	res.status(HttpStatus.Created).send(comment.data)
}
