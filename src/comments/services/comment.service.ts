import mongoose from 'mongoose'
import { commentRepository } from '../repository/comment.repository'
import { CommentDto, UpdateCommentDto } from '../types/comment.dto'

export const commentService = {
	addCommentByPostId: async (dto: CommentDto) => {
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
