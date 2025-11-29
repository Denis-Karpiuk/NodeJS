import { CommentQwRepository } from './../repository/comment.query.repository'
import { injectable } from 'inversify'
import { ResultStatus } from '../../core/result/resultStatus'
import { PostsRepository } from '../../posts/repository/posts.repository'
import {
	CommentDto,
	LikeCommentDto,
	UpdateCommentDto,
} from '../types/comment.dto'
import { CommentRepository } from './../repository/comment.repository'
import { Result } from '../../core/result/result.type'

@injectable()
export class CommentService {
	constructor(
		protected commentRepository: CommentRepository,
		protected postsRepository: PostsRepository,
		protected commentQwRepository: CommentQwRepository
	) {}

	async addCommentByPostId(dto: CommentDto) {
		const postResult = await this.postsRepository.getPostById(dto.postId)

		if (!postResult) {
			return {
				status: ResultStatus.NotFound,
				extensions: 'Post not found',
				data: null,
			}
		}

		const newCommentBody = {
			...dto,
			createdAt: new Date(),
		}

		return await this.commentRepository.addOne(newCommentBody)
	}

	async deleteCommentById(id: string) {
		return await this.commentRepository.deleteOne(id)
	}

	async updateCommentById(dto: UpdateCommentDto) {
		return await this.commentRepository.updateOne(dto.id, dto.content)
	}

	async likeComment(dto: LikeCommentDto): Promise<Result<null>> {
		const commentByIdResult = await this.commentQwRepository.findById(
			dto.commentId
		)

		if (commentByIdResult.status !== ResultStatus.Success) {
			return {
				status: ResultStatus.NotFound,
				extensions: [
					{ field: 'commentId', message: 'Comment not found' },
				],
				data: null,
			}
		}

		const commentInfo = commentByIdResult.data

		const likesData = commentInfo?.likesInfo

		if (likesData) {
			if (dto.likeStatus === 'Like' && likesData.myStatus === 'None') {
				likesData.likesCount++
				likesData.myStatus = 'Like'
			} else if (
				dto.likeStatus === 'Like' &&
				likesData.myStatus === 'Dislike'
			) {
				likesData.dislikesCount--
				likesData.likesCount++
				likesData.myStatus = 'Like'
			} else if (
				dto.likeStatus === 'Dislike' &&
				likesData.myStatus === 'None'
			) {
				likesData.dislikesCount++
				likesData.myStatus = 'Dislike'
			} else if (
				dto.likeStatus === 'Dislike' &&
				likesData.myStatus === 'Like'
			) {
				likesData.likesCount--
				likesData.dislikesCount++
				likesData.myStatus = 'Dislike'
			} else if (
				dto.likeStatus === 'None' &&
				likesData.myStatus === 'Like'
			) {
				likesData.likesCount--
				likesData.myStatus = 'None'
			} else if (
				dto.likeStatus === 'None' &&
				likesData.myStatus === 'Dislike'
			) {
				likesData.dislikesCount--
				likesData.myStatus = 'None'
			}

			const updateResult = await this.commentRepository.updateLikesInfo(
				commentInfo.id,
				likesData
			)

			if (!updateResult) {
				return {
					status: ResultStatus.NotFound,
					extensions: [
						{ field: 'commentId', message: 'Comment not found' },
					],
					data: null,
				}
			}
		}

		return {
			status: ResultStatus.Success,
			extensions: [],
			data: null,
		}
	}
}
