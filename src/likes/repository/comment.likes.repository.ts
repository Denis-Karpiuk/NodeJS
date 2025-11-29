import { injectable } from 'inversify'
import { CommentsLikesModel } from '../../models/comments.likes.model'
import { CommentType } from '../types/types'

@injectable()
export class CommentsLikesRepository {
	async getLikeByUserIdAndCommentId(
		userId: string,
		commentId: string
	): Promise<null | CommentType> {
		try {
			return await CommentsLikesModel.findOne({
				userId,
				commentId,
			}).lean()
		} catch (error) {
			return null
		}
	}

	async addLike(dto: CommentType): Promise<boolean> {
		try {
			const newLike = new CommentsLikesModel(dto)
			await newLike.save()
			return true
		} catch (error) {
			return false
		}
	}

	async updateLike(dto: CommentType): Promise<boolean> {
		try {
			await CommentsLikesModel.updateOne(
				{
					userId: dto.userId,
					commentId: dto.commentId,
				},
				{
					$set: {
						likeStatus: dto.likeStatus,
					},
				}
			)

			return true
		} catch (error) {
			return false
		}
	}
}
