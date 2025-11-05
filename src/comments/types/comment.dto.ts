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
