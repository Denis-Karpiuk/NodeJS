import { injectable } from 'inversify'
import { BlogsRepository, BlogType } from '../repository/blogs.mongo.repository'
export type BlogSearchParamsType = {
	searchNameTerm: string
	sortBy: string
	sortDirection: 'asc' | 'desc'
	pageNumber: number
	pageSize: number
}

export type BlogsSearchResultType = {
	pagesCount: number
	page: number
	pageSize: number
	totalCount: number
	items: BlogType[]
}

type ParamsType = any

@injectable()
export class BlogsService {
	constructor(protected blogsRepository: BlogsRepository) {}

	async findMany(params: ParamsType): Promise<BlogsSearchResultType> {
		return this.blogsRepository.findMany(params)
	}
}
