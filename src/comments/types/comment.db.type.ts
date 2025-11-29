import { ObjectId } from 'mongodb'

export type CommentDbType = {
	postId: string
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
	_id: ObjectId
	createdAt: Date
}
