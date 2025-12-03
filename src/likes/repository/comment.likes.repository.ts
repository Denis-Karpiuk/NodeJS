import { injectable } from 'inversify'
import { LikeDto, LikeType } from '../types/types'
import { CommentsLikesModel } from '../model/comments.like.model'
import { PostLikesModel } from '../model/post.likes.model'

@injectable()
export class CommentsLikesRepository {
	async getCountLikesByFilter(filter: {
		id: string
		likeStatus: string
	}): Promise<number> {
		try {
			return await CommentsLikesModel.countDocuments(filter).lean()
		} catch (error) {
			return 0
		}
	}

	async findLikesByCommentId(commentId: string): Promise<LikeType[] | null> {
		try {
			return await CommentsLikesModel.find({
				id: commentId,
			}).lean()
		} catch (error) {
			return null
		}
	}

	async findLikeByUserIdAndCommentId(
		userId: string,
		commentId: string
	): Promise<null | LikeType> {
		try {
			return await CommentsLikesModel.findOne({
				userId,
				id: commentId,
			}).lean()
		} catch (error) {
			return null
		}
	}

	async addLike(dto: LikeDto): Promise<boolean> {
		try {
			const newLike = new CommentsLikesModel(dto)
			await newLike.save()
			return true
		} catch (error) {
			return false
		}
	}

	async updateLike(dto: LikeDto): Promise<boolean> {
		try {
			await CommentsLikesModel.updateOne(
				{
					userId: dto.userId,
					id: dto.id,
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

	async getCountPostLikesByFilter(filter: {
		id: string
		likeStatus: string
	}): Promise<number> {
		try {
			return await PostLikesModel.countDocuments(filter).lean()
		} catch (error) {
			return 0
		}
	}

	async findPostLikesByPostId(
		commentId: string,
		size = 3
	): Promise<LikeType[] | null> {
		try {
			return await PostLikesModel.find({
				id: commentId,
			})
				.skip(0)
				.limit(size)
				.sort({ createdAt: -1 })
				.lean()
		} catch (error) {
			return null
		}
	}

	async findPostLikeByUserIdAndCommentId(
		userId: string,
		postId: string
	): Promise<null | LikeType> {
		try {
			return await PostLikesModel.findOne({
				userId,
				id: postId,
			}).lean()
		} catch (error) {
			return null
		}
	}

	async addPostLike(dto: LikeDto): Promise<boolean> {
		try {
			const newLike = new PostLikesModel(dto)
			await newLike.save()
			return true
		} catch (error) {
			return false
		}
	}

	async updatePostLike(dto: LikeDto): Promise<boolean> {
		try {
			await PostLikesModel.updateOne(
				{
					userId: dto.userId,
					id: dto.id,
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
