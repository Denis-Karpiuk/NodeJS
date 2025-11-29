import { injectable } from 'inversify'
import { Result } from '../../core/result/result.type'
import { CommentsLikesRepository } from '../repository/comment.likes.repository'
import { CommentLikeType } from '../types/types'
import { CommentQwRepository } from '../../comments/repository/comment.query.repository'
import { ResultStatus } from '../../core/result/resultStatus'

@injectable()
export class CommentsLikeService {
	constructor(
		protected commentsLikesRepository: CommentsLikesRepository,
		protected commentQwRepository: CommentQwRepository
	) {}

	async addLikeToComment(dto: CommentLikeType): Promise<Result<boolean>> {
		const commentById = await this.commentQwRepository.findById(
			dto.commentId
		)

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
			await this.commentsLikesRepository.findLikeByUserIdAndCommentId(
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
