import { paginationAndSortingDefault } from '../middlewares/query-pagination-sorting.validatiion-middleware'
import { PaginationAndSorting } from '../types/pagination-and-sorting'

export function setDefaultSortAndPaginationIfNotExist<P = string>(
	query: Partial<PaginationAndSorting<P>>
): PaginationAndSorting<P> {
	return {
		pageNumber: query.pageNumber ?? paginationAndSortingDefault.pageNumber,
		pageSize: query.pageSize ?? paginationAndSortingDefault.pageSize,
		sortBy: (query.sortBy ?? paginationAndSortingDefault.sortBy) as P,
		sortDirection:
			query.sortDirection ?? paginationAndSortingDefault.sortDirection,
	}
}
