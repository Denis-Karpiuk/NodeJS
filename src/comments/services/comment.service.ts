import { injectable } from 'inversify'
import { Result } from '../../core/result/result.type'
import { ResultStatus } from '../../core/result/resultStatus'
import { CommentsLikeService } from '../../likes/servece/comments.like.service'
import { PostsRepository } from '../../posts/repository/posts.repository'
import { CommentDto, UpdateCommentDto } from '../types/comment.dto'
import { CommentViewType } from '../types/comment.view.type'
import { mapCommentFromDbToView } from './../repository/comment.query.repository'
import { CommentRepository } from './../repository/comment.repository'
import { LikeStatusEnum } from '../../likes/types/types'

@injectable()
export class CommentService {
	constructor(
		protected commentRepository: CommentRepository,
		protected postsRepository: PostsRepository,
		protected commentLikeService: CommentsLikeService
	) {}

	async getCommentById(
		id: string,
		userId?: string
	): Promise<Result<null | (CommentViewType & { likesInfo: any })>> {
		const comment = await this.commentRepository.findById(id)

		if (!comment) {
			return {
				status: ResultStatus.NotFound,
				extensions: [{ field: 'id', message: 'Comment not found' }],
				data: null,
			}
		}

		const commentResult = mapCommentFromDbToView(comment)

		const likeInfoResult =
			await this.commentLikeService.getCommentsLikesInfo(id, userId)

		if (likeInfoResult.status === ResultStatus.NotFound) {
			return {
				status: ResultStatus.NotFound,
				extensions: [{ field: 'id', message: 'Comment not found' }],
				data: null,
			}
		}

		const result = { ...commentResult, likesInfo: likeInfoResult.data }

		return {
			status: ResultStatus.Success,
			data: result,
		}
	}

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

		const createdCommentResult =
			await this.commentRepository.addOne(newCommentBody)

		if (
			createdCommentResult.status === ResultStatus.Success &&
			createdCommentResult.data
		) {
			await this.commentLikeService.addLikeToComment({
				id: createdCommentResult.data,
				userId: newCommentBody.commentatorInfo.userId,
				likeStatus: LikeStatusEnum.None,
			})
		}

		return createdCommentResult
	}

	async deleteCommentById(id: string) {
		return await this.commentRepository.deleteOne(id)
	}

	async updateCommentById(dto: UpdateCommentDto) {
		return await this.commentRepository.updateOne(dto.id, dto.content)
	}
}
