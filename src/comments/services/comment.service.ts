import mongoose from 'mongoose'
import { commentRepository } from '../repository/comment.repository'
import { CommentDto, UpdateCommentDto } from '../types/comment.dto'
import { postsRepository } from '../../posts/repository/posts.repository'
import { ResultStatus } from '../../core/result/resultStatus'

export const commentService = {
	addCommentByPostId: async (dto: CommentDto) => {
		const postResult = await postsRepository.getPostById(dto.postId)

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

		return await commentRepository.addOne(newCommentBody)
	},
	deleteCommentById: async (id: string) => {
		return await commentRepository.deleteOne(id)
	},

	updateCommentById: async (dto: UpdateCommentDto) => {
		return await commentRepository.updateOne(dto.id, dto.content)
	},
}
