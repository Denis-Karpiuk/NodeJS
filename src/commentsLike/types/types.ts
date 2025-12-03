export enum LikeStatusEnum {
	Like = 'Like',
	Dislike = 'Dislike',
	None = 'None',
}

export type CommentLikeType = {
	commentId: string
	likeStatus: LikeStatusEnum
	userId: string
}

export type LikesInfoType = {
	likesCount: number
	dislikesCount: number
	myStatus: LikeStatusEnum
}

export type LikeCommentDto = {
	commentId: string
	likeStatus: LikeStatusEnum
}
