import { CommentService } from './../services/comment.service'
import { injectable } from 'inversify'
import { Request, Response } from 'express'
import { ResultStatus } from '../../core/result/resultStatus'
import { resultCodeToHttpException } from '../../core/result/resultStatusToHttpCode'
import { HttpStatus } from '../../core/types/http-statuses'
import { CommentQwRepository } from '../repository/comment.query.repository'

@injectable()
export class CommentsController {
	constructor(
		protected commentService: CommentService,
		protected commentQwRepository: CommentQwRepository
	) {
		this.getComment = this.getComment.bind(this)
		this.updateComment = this.updateComment.bind(this)
		this.deleteComment = this.deleteComment.bind(this)
		this.likeComment = this.likeComment.bind(this)
	}

	async getComment(req: Request, res: Response) {
		const id = req.params.id

		const result = await this.commentQwRepository.findById(id)

		if (result.status !== ResultStatus.Success) {
			return res
				.status(resultCodeToHttpException(result.status))
				.send({ errorsMessages: result.extensions })
		}

		res.status(HttpStatus.Success).send(result.data)
	}

	async updateComment(req: Request, res: Response) {
		const id = req.params.id

		const result = await this.commentService.updateCommentById({
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

	async deleteComment(req: Request, res: Response) {
		const id = req.params.id

		const result = await this.commentService.deleteCommentById(id)

		if (result.status !== ResultStatus.Success) {
			return res
				.status(resultCodeToHttpException(result.status))
				.send({ errorsMessages: result.extensions })
		}
		res.status(HttpStatus.NoContent).send(result.data)
	}

	async likeComment(req: Request, res: Response) {
		const id = req.params.id
		const body = req.body

		const result = await this.commentService.likeComment({
			commentId: id,
			...body,
		})

		if (result.status !== ResultStatus.Success) {
			return res
				.status(resultCodeToHttpException(result.status))
				.send({ errorsMessages: result.extensions })
		}
		res.status(HttpStatus.NoContent).send(result.data)
	}
}
