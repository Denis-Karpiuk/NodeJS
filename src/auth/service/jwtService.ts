import jwt, { JwtPayload } from 'jsonwebtoken'
import { appConfig } from '../../core/config/config'
import { RefreshTokenType } from '../../core/types/common.types'
import { injectable } from 'inversify'
export interface MyJwtPayload extends JwtPayload {
	userId: string
	login: string
}

@injectable()
export class JwtService {
	async createToken({
		deviceId,
		userId,
		login,
		expiresIn,
	}: {
		deviceId?: string
		userId: string
		login: string
		expiresIn: any
	}): Promise<string> {
		return jwt.sign({ userId, login, deviceId }, appConfig.AC_SECRET, {
			expiresIn: expiresIn ?? '1h',
		})
	}

	async decodeToken(token: string): Promise<RefreshTokenType> {
		return jwt.decode(token) as RefreshTokenType
	}

	async verifyToken(token: string): Promise<MyJwtPayload> {
		try {
			return jwt.verify(token, appConfig.AC_SECRET) as MyJwtPayload
		} catch (err) {
			throw new Error('Invalid or expired token')
		}
	}
}

export const jwtService = new JwtService()
