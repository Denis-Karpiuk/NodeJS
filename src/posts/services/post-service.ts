import { postsRepository } from '../repository/posts.repository'

export const postsService = {
	async findMany(params: any): Promise<any> {
		return postsRepository.findMany(params)
	},
}
