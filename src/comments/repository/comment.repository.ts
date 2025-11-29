import { injectable } from 'inversify'
import { Result } from '../../core/result/result.type'
import { ResultStatus } from '../../core/result/resultStatus'
import { CommentModel } from '../../models/comments.model'
import { CommentDbType } from '../types/comment.db.type'

@injectable()
export class CommentRepository {
	async findById(id: string) {
		return await CommentModel.findById(id).lean()
	}

	async addOne(comment: Omit<CommentDbType, '_id'>): Promise<Result<string>> {
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
	}

	async deleteOne(id: string): Promise<Result<string>> {
		try {
			if (!id) {
				return {
					status: ResultStatus.NotFound,
					data: '',
					errorMessage: 'Comment not found',
				}
			}

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
	}

	async updateOne(id: string, content: string): Promise<Result<string>> {
		try {
			if (!id) {
				return {
					status: ResultStatus.NotFound,
					data: '',
					errorMessage: 'Comment not found',
				}
			}

			const updatedComment = await CommentModel.findByIdAndUpdate(
				id,
				{
					content,
				},
				{ new: true }
			)

			if (!updatedComment) {
				return {
					status: ResultStatus.NotFound,
					data: '',
					errorMessage: 'Comment not found',
				}
			}

			return {
				status: ResultStatus.Success,
				data: 'Comment was updated',
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
	}

	async updateLikesInfo(id: string, likesInfo: any): Promise<boolean> {
		try {
			await CommentModel.updateOne(
				{ _id: id },
				{
					$set: {
						likesInfo: likesInfo,
					},
				}
			)

			return true
		} catch {
			return false
		}
	}
}
