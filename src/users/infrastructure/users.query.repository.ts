import { isValidObjectId } from 'mongoose'
import { UsersModel } from '../../models/users.model'

export const usersQueryRepository = {
	async findAllUsers() {},
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
	},
}
