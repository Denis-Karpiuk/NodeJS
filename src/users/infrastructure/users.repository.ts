import { UsersModel } from '../../models/users.model'
import { UserDBType } from '../types/user.db.type'

export const usersRepository = {
	async findByEmailOrLogin(emailOrLogin: string) {
		return await UsersModel.findOne({
			$or: [{ email: emailOrLogin }, { login: emailOrLogin }],
		})
	},

	async create(user: UserDBType): Promise<string> {
		const newUser = new UsersModel(user)
		await newUser.save()

		return newUser._id.toString()
	},
}
