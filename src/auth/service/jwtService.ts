import jwt from 'jsonwebtoken'
import { appConfig } from '../../core/config/config'

export const jwtService = {
	createToken: async (userId: string): Promise<string> => {
		return jwt.sign({ userId }, appConfig.AC_SECRET, {})
	},
}
