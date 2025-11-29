import { CommentService } from './../services/comment.service'
import { injectable } from 'inversify'
import { Request, Response } from 'express'
import { ResultStatus } from '../../core/result/resultStatus'
import { resultCodeToHttpException } from '../../core/result/resultStatusToHttpCode'
import { HttpStatus } from '../../core/types/http-statuses'
import { CommentQwRepository } from '../repository/comment.query.repository'
import { CommentsLikeService } from '../../likes/servece/comments.like.service'

@injectable()
export class CommentsController {
	constructor(
		protected commentService: CommentService,
		protected commentsLikeService: CommentsLikeService,
		protected commentQwRepository: CommentQwRepository
	) {
		this.getComment = this.getComment.bind(this)
		this.updateComment = this.updateComment.bind(this)
		this.deleteComment = this.deleteComment.bind(this)
		this.addLikeStatusToComment = this.addLikeStatusToComment.bind(this)
	}

	async getComment(req: Request, res: Response) {
		debugger
		const id = req.params.id
		const user = req.context!.user

		const result = await this.commentService.getCommentById(id, user!.id)

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

	async addLikeStatusToComment(req: Request, res: Response) {
		const id = req.params.id
		const body = req.body
		const user = req.context!.user!

		const result = await this.commentsLikeService.addLikeToComment({
			commentId: id,
			...body,
			userId: user.id,
		})

		if (result.status !== ResultStatus.Success) {
			return res
				.status(resultCodeToHttpException(result.status))
				.send({ errorsMessages: result.extensions })
		}
		res.status(HttpStatus.NoContent).send(result.data)
	}
}
