export type CommentDto = {
	postId: string
	content: string
	commentatorInfo: {
		userId: string
		userLogin: string
	}
}
