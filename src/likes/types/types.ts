export enum LikeStatusEnum {
	Like = 'Like',
	Dislike = 'Dislike',
	None = 'None',
}

export type LikeType = {
	id: string
	likeStatus: LikeStatusEnum
	userId: string
	createdAt: Date
	updatedAt: Date
}

export type LikesInfoType = {
	likesCount: number
	dislikesCount: number
	myStatus: LikeStatusEnum
}

export type LikeCommentDto = {
	id: string
	likeStatus: LikeStatusEnum
}

export type LikeDto = {
	id: string
	likeStatus: LikeStatusEnum
	userId: string
}

export type ExtendedLikeInfoType = LikesInfoType & {
	newestLikes: { addedAt: Date; userId: string; login: string }[]
}
