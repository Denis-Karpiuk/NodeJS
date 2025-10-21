import { create } from 'domain'
import { postsRepository } from '../repository/posts.repository'
import { newPostBodyType } from '../dto/input.post.dto'

export const postsService = {
	async findMany(params: any): Promise<any> {
		return postsRepository.findMany(params)
	},

	async createPost(body: newPostBodyType): Promise<any> {
		return postsRepository.addPost(body)
	},
}
