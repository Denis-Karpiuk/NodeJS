export type CommentViewType = {
	id: string
	content: string
	commentatorInfo: {
		userId: string
		userLogin: string
	}
	createdAt: Date
}
