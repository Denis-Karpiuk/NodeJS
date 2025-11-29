import { injectable } from 'inversify'
import { Result } from '../../core/result/result.type'
import { ResultStatus } from '../../core/result/resultStatus'
import { CommentsLikesRepository } from '../../likes/repository/comment.likes.repository'
import { CommentLikeType } from '../../likes/types/types'
import { PostsRepository } from '../../posts/repository/posts.repository'
import {
	CommentDto,
	LikeStatusEnum,
	UpdateCommentDto,
} from '../types/comment.dto'
import { CommentViewType } from '../types/comment.view.type'
import { mapCommentFromDbToView } from './../repository/comment.query.repository'
import { CommentRepository } from './../repository/comment.repository'

export type LikesInfoType = {
	likesCount: number
	dislikesCount: number
	myStatus: LikeStatusEnum
}

@injectable()
export class CommentService {
	constructor(
		protected commentRepository: CommentRepository,
		protected postsRepository: PostsRepository,
		protected commentsLikesRepository: CommentsLikesRepository
	) {}

	async getCommentById(
		id: string,
		userId: string
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

		const likesCount =
			await this.commentsLikesRepository.getCountLikesByFilter({
				commentId: id,
				likeStatus: LikeStatusEnum.Like,
			})

		const dislikesCount =
			await this.commentsLikesRepository.getCountLikesByFilter({
				commentId: id,
				likeStatus: LikeStatusEnum.Dislike,
			})

		const userLike =
			await this.commentsLikesRepository.findLikeByUserIdAndCommentId(
				userId,
				id
			)

		let likesInfo = {
			likesCount,
			dislikesCount,
			myStatus: userLike?.likeStatus || LikeStatusEnum.None,
		}

		const result = { ...commentResult, likesInfo }

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

		return await this.commentRepository.addOne(newCommentBody)
	}

	async deleteCommentById(id: string) {
		return await this.commentRepository.deleteOne(id)
	}

	async updateCommentById(dto: UpdateCommentDto) {
		return await this.commentRepository.updateOne(dto.id, dto.content)
	}
}
