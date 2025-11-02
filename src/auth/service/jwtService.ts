import jwt from 'jsonwebtoken'
import { appConfig } from '../../core/config/config'
import { decode } from 'punycode'

export const jwtService = {
	createToken: async (userId: string): Promise<string> => {
		return jwt.sign({ userId }, appConfig.AC_SECRET, {})
	},

	decodeToken: async (token: string): Promise<any> => {
		return jwt.decode(token)
	},
}
