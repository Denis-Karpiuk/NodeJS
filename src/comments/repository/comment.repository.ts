import { Result } from '../../core/result/result.type'
import { ResultStatus } from '../../core/result/resultStatus'
import { CommentModel } from '../../models/comments.model'
import { CommentDbType } from '../types/comment.db.type'

export const commentRepository = {
	async addComment(comment: CommentDbType): Promise<Result<string>> {
		try {
			const newComment = new CommentModel(comment)
			const savedNewComment = await newComment.save()

			return {
				status: ResultStatus.Success,
				data: savedNewComment._id.toString(),
				errorMessage: '',
			}
		} catch (error) {
			return {
				status: ResultStatus.Failure,
				data: '',
				errorMessage:
					error instanceof Error ? error.message : 'Unknown error',
			}
		}
	},

	async deleteCommentById(id: string): Promise<Result<string>> {
		try {
			const deletedComment = await CommentModel.findByIdAndDelete(id)

			if (!deletedComment) {
				return {
					status: ResultStatus.NotFound,
					data: '',
					errorMessage: 'Comment not found',
				}
			}

			return {
				status: ResultStatus.Success,
				data: 'Comment was deleted',
				errorMessage: '',
			}
		} catch (error) {
			return {
				status: ResultStatus.Failure,
				data: '',
				errorMessage:
					error instanceof Error ? error.message : 'Unknown error',
			}
		}
	},
}
