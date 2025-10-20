import { PaginationAndSorting } from '../../core/types/pagination-and-sorting'
import { blogsRepository, BlogType } from '../repository/blogs.mongo.repository'

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

export const blogsService = {
	async findMany(
		params: PaginationAndSorting<{ createdAt: string }> &
			Partial<BlogSearchParamsType>
	): Promise<BlogsSearchResultType> {
		return blogsRepository.findMany(params)
	},

	async getBlogById(id: string) {},
}
