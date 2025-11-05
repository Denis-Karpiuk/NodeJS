import mongoose from 'mongoose'
import { commentRepository } from '../repository/comment.repository'
import { CommentDto } from '../types/comment.dto'

export const commentService = {
	addCommentByPostId: async (dto: CommentDto) => {
		const newCommentBody = {
			...dto,
			createdAt: new Date(),
		}

		return await commentRepository.addComment(newCommentBody)
	},
	deleteCommentById: async (id: string) => {
		return await commentRepository.deleteCommentById(id)
	},
}
