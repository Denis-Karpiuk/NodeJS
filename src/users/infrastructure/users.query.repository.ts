import { isValidObjectId } from 'mongoose'
import { UsersModel } from '../../models/users.model'
import { PaginationAndSorting } from '../../core/types/pagination-and-sorting'
import { UsersViewType } from '../types/users.view.type'
import { PaginationType } from '../../core/types/pagination.type'
import { SortDirection } from '../../core/types/sort-direction'
import { injectable } from 'inversify'

export type QueryPaginationAndSorting = PaginationAndSorting<string> & {
	searchLoginTerm: string
	searchEmailTerm: string
}

@injectable()
export class UsersQueryRepository {
	async findAllUsers({
		pageNumber,
		pageSize,
		searchEmailTerm,
		searchLoginTerm,
		sortBy,
		sortDirection,
	}: any): Promise<PaginationType<UsersViewType[]>> {
		const skip = (pageNumber - 1) * pageSize
		const findFilter: any = {}

		if (searchEmailTerm || searchLoginTerm) {
			findFilter.$or = []

			if (searchEmailTerm) {
				findFilter.$or.push({
					email: { $regex: searchEmailTerm, $options: 'i' },
				})
			}

			if (searchLoginTerm) {
				findFilter.$or.push({
					login: { $regex: searchLoginTerm, $options: 'i' },
				})
			}
		}

		const users = await UsersModel.find(findFilter)
			.sort({ [sortBy]: sortDirection === SortDirection.Asc ? 1 : -1 })
			.skip(skip)
			.limit(pageSize)
			.lean()

		const totalCount = await UsersModel.countDocuments(findFilter)

		return {
			pagesCount: Math.ceil(totalCount / pageSize),
			page: pageNumber,
			pageSize,
			totalCount,
			items: users.map(this.mapUserToResponse),
		}
	}
	async findUserById(id: string) {
		if (!isValidObjectId(id)) {
			return null
		}

		const user = await UsersModel.findById(id).lean()

		if (!user) {
			return null
		}

		return {
			id: user._id.toString(),
			login: user.login,
			email: user.email,
			createdAt: user.createdAt,
		}
	}

	mapUserToResponse(user: any): UsersViewType {
		return {
			id: user._id.toString(),
			email: user.email,
			login: user.login,
			createdAt: user.createdAt,
		}
	}
}

export const usersQueryRepository = new UsersQueryRepository()
