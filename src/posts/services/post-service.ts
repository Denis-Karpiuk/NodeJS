import { CommentService } from '../../comments/services/comment.service'
import { CommentDto } from '../../comments/types/comment.dto'
import { newPostBodyType } from '../dto/input.post.dto'
import { PostsRepository } from '../repository/posts.repository'
import { injectable } from 'inversify'

@injectable()
export class PostsService {
	constructor(
		protected commentService: CommentService,
		protected postsRepository: PostsRepository
	) {}

	async findMany(params: any): Promise<any> {
		return this.postsRepository.findMany(params)
	}

	async createPost(body: newPostBodyType): Promise<any> {
		return this.postsRepository.addPost(body)
	}

	async createPostComment(dto: CommentDto): Promise<any> {
		return await this.commentService.addCommentByPostId(dto)
	}
}
