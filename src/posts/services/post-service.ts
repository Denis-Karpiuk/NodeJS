import { commentService } from '../../comments/services/comment.service'
import { CommentDto } from '../../comments/types/comment.dto'
import { newPostBodyType } from '../dto/input.post.dto'
import { postsRepository } from '../repository/posts.repository'

export const postsService = {
	async findMany(params: any): Promise<any> {
		return postsRepository.findMany(params)
	},

	async createPost(body: newPostBodyType): Promise<any> {
		return postsRepository.addPost(body)
	},

	async createPostComment(dto: CommentDto): Promise<any> {
		return await commentService.addCommentByPostId(dto)
	},
}
