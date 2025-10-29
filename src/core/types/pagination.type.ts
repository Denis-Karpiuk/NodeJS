export type PaginationType<I> = {
	pagesCount: number
	page: number
	pageSize: number
	totalCount: number
	items: I
}
