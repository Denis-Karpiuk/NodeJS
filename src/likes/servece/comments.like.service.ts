import { usersService } from './../../users/service/users.service'
import { injectable } from 'inversify'
import { Result } from '../../core/result/result.type'
import { CommentsLikesRepository } from '../repository/comment.likes.repository'
import {
	LikesInfoType,
	LikeStatusEnum,
	LikeDto,
	ExtendedLikeInfoType,
} from '../types/types'
import { CommentQwRepository } from '../../comments/repository/comment.query.repository'
import { ResultStatus } from '../../core/result/resultStatus'
import { PostsRepository } from '../../posts/repository/posts.repository'
import { UsersQueryRepository } from '../../users/infrastructure/users.query.repository'

@injectable()
export class CommentsLikeService {
	constructor(
		protected commentsLikesRepository: CommentsLikesRepository,
		protected commentQwRepository: CommentQwRepository,
		protected postRepository: PostsRepository,
		protected usersQueryRepository: UsersQueryRepository
	) {}

	async getCommentsLikesInfo(
		commentId: string,
		userId?: string
	): Promise<Result<LikesInfoType>> {
		const likesCount =
			await this.commentsLikesRepository.getCountLikesByFilter({
				id: commentId,
				likeStatus: LikeStatusEnum.Like,
			})

		const dislikesCount =
			await this.commentsLikesRepository.getCountLikesByFilter({
				id: commentId,
				likeStatus: LikeStatusEnum.Dislike,
			})

		let userLike

		if (userId) {
			userLike =
				await this.commentsLikesRepository.findLikeByUserIdAndCommentId(
					userId,
					commentId
				)
		}

		return {
			status: ResultStatus.Success,
			data: {
				likesCount,
				dislikesCount,
				myStatus: userLike?.likeStatus || LikeStatusEnum.None,
			},
		}
	}

	async addLikeToComment(dto: LikeDto): Promise<Result<boolean>> {
		const commentByIdResult = await this.commentQwRepository.findById(
			dto.id
		)

		if (commentByIdResult.status !== ResultStatus.Success) {
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
				dto.id
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

	async addLikeToPost(dto: LikeDto): Promise<Result<boolean>> {
		const commentByIdResult = await this.postRepository.getPostById(dto.id)

		if (!commentByIdResult) {
			return {
				status: ResultStatus.NotFound,
				data: false,
				extensions: [{ field: 'postId', message: 'Post not found' }],
			}
		}

		const currentLike =
			await this.commentsLikesRepository.findPostLikeByUserIdAndCommentId(
				dto.userId,
				dto.id
			)

		if (currentLike?.likeStatus === dto.likeStatus) {
			return {
				status: ResultStatus.Success,
				data: true,
			}
		}

		if (!currentLike) {
			const result = await this.commentsLikesRepository.addPostLike(dto)

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

		await this.commentsLikesRepository.updatePostLike(dto)

		return {
			status: ResultStatus.Success,
			data: true,
		}
	}

	async getPostsLikesInfo(
		postId: string,
		userId?: string
	): Promise<Result<ExtendedLikeInfoType>> {
		const likesCount =
			await this.commentsLikesRepository.getCountPostLikesByFilter({
				id: postId,
				likeStatus: LikeStatusEnum.Like,
			})

		const dislikesCount =
			await this.commentsLikesRepository.getCountPostLikesByFilter({
				id: postId,
				likeStatus: LikeStatusEnum.Dislike,
			})

		const newestLikes =
			await this.commentsLikesRepository.findPostLikesByPostId(postId, 3)

		let userLike

		if (userId) {
			userLike =
				await this.commentsLikesRepository.findPostLikeByUserIdAndCommentId(
					userId,
					postId
				)
		}

		const prepareNewestLikes = await Promise.all(
			(newestLikes || []).map(async like => {
				const user = await this.usersQueryRepository.findUserById(
					like.userId
				)

				return {
					addedAt: like.updatedAt,
					userId: like.userId,
					login: user?.login || 'unknown',
				}
			})
		)

		return {
			status: ResultStatus.Success,
			data: {
				likesCount,
				dislikesCount,
				myStatus: userLike?.likeStatus || LikeStatusEnum.None,
				newestLikes: prepareNewestLikes,
			},
		}
	}
}
