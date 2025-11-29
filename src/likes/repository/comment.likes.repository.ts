import { injectable } from 'inversify'
import { CommentsLikesModel } from '../../models/comments.likes.model'
import { CommentLikeType } from '../types/types'

@injectable()
export class CommentsLikesRepository {
	async getCountLikesByFilter(filter: {
		commentId: string
		likeStatus: string
	}): Promise<number> {
		try {
			return await CommentsLikesModel.countDocuments(filter).lean()
		} catch (error) {
			return 0
		}
	}

	async findLikesByCommentId(
		commentId: string
	): Promise<CommentLikeType[] | null> {
		try {
			return await CommentsLikesModel.find({
				commentId,
			}).lean()
		} catch (error) {
			return null
		}
	}

	async findLikeByUserIdAndCommentId(
		userId: string,
		commentId: string
	): Promise<null | CommentLikeType> {
		try {
			return await CommentsLikesModel.findOne({
				userId,
				commentId,
			}).lean()
		} catch (error) {
			return null
		}
	}

	async addLike(dto: CommentLikeType): Promise<boolean> {
		try {
			const newLike = new CommentsLikesModel(dto)
			await newLike.save()
			return true
		} catch (error) {
			return false
		}
	}

	async updateLike(dto: CommentLikeType): Promise<boolean> {
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
