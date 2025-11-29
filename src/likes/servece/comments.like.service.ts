import { injectable } from 'inversify'
import { CommentRepository } from '../../comments/repository/comment.repository'
import { Result } from '../../core/result/result.type'
import { CommentsLikesRepository } from '../repository/comment.likes.repository'
import { CommentType } from '../types/types'
import { CommentQwRepository } from '../../comments/repository/comment.query.repository'
import { ResultStatus } from '../../core/result/resultStatus'

@injectable()
export class CommentsLikeService {
	constructor(
		protected commentsLikesRepository: CommentsLikesRepository,
		protected commentQwRepository: CommentQwRepository
	) {}

	async addLikeToComment(dto: CommentType): Promise<Result<boolean>> {
		const commentById = await this.commentQwRepository.findById(
			dto.commentId
		)
		debugger
		if (!commentById) {
			return {
				status: ResultStatus.NotFound,
				data: false,
				extensions: [
					{ field: 'commentId', message: 'Comment not found' },
				],
			}
		}

		const currentLike =
			await this.commentsLikesRepository.getLikeByUserIdAndCommentId(
				dto.userId,
				dto.commentId
			)

		if (currentLike?.likeStatus === dto.likeStatus) {
			return {
				status: ResultStatus.Success,
				data: true,
			}
		}

		if (!currentLike) {
			const result = await this.commentsLikesRepository.addLike(dto)

			if (result) {
				return {
					status: ResultStatus.Success,
					data: true,
				}
			}

			return {
				status: ResultStatus.Failure,
				data: false,
				errorMessage: 'Add like crashed',
			}
		}

		await this.commentsLikesRepository.updateLike(dto)

		return {
			status: ResultStatus.Success,
			data: true,
		}
	}
}
