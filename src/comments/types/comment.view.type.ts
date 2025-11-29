export type CommentViewType = {
	id: string
	content: string
	commentatorInfo: {
		userId: string
		userLogin: string
	}
	likesInfo: {
		likesCount: number
		dislikesCount: number
		myStatus: string
	}
	createdAt: Date
}
