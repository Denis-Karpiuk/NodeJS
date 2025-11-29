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
}
