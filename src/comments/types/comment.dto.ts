export type CommentDto = {
	postId: string
	content: string
	commentatorInfo: {
		userId: string
		userLogin: string
	}
}

export type UpdateCommentDto = {
	content: string
	id: string
}

export enum LikeStatusEnum {
	Like = 'Like',
	Dislike = 'Dislike',
	None = 'None',
}
export type LikeCommentDto = {
	commentId: string
	likeStatus: LikeStatusEnum
}
