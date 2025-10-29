import { isValidObjectId } from 'mongoose'
import { UsersModel } from '../../models/users.model'
import { UserDBType } from '../types/user.db.type'

export const usersRepository = {
	async findByEmailOrLogin(loginOrEmail: string) {
		return await UsersModel.findOne({
			$or: [{ email: loginOrEmail }, { login: loginOrEmail }],
		}).lean()
	},

	async create(user: UserDBType): Promise<string> {
		const newUser = new UsersModel(user)
		await newUser.save()

		return newUser._id.toString()
	},

	async deleteUserById(id: string) {
		if (!isValidObjectId(id)) {
			return null
		}

		return await UsersModel.findByIdAndDelete(id)
	},
}
