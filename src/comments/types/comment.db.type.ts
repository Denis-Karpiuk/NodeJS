import { ObjectId } from 'mongodb'

export type CommentDbType = {
	postId: string
	content: string
	commentatorInfo: {
		userId: string
		userLogin: string
	}
	_id: ObjectId
	createdAt: Date
}
