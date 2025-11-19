import { Result } from '../../core/result/result.type'
import { ResultStatus } from '../../core/result/resultStatus'
import {
	TokenBlackListDBType,
	TokenBlackListModel,
} from '../../models/tokensBlackList'

export const tokenBlackListRepository = {
	async addOne(token: TokenBlackListDBType): Promise<Result<string>> {
		try {
			const newToken = new TokenBlackListModel(token)
			const savedToken = await newToken.save()

			return {
				status: ResultStatus.Success,
				data: savedToken._id.toString(),
				errorMessage: '',
			}
		} catch (error) {
			return {
				status: ResultStatus.Failure,
				data: '',
				errorMessage:
					error instanceof Error ? error.message : 'Unknown error',
			}
		}
	},

	async findOne(token: string): Promise<Result<TokenBlackListDBType | null>> {
		try {
			const result = await TokenBlackListModel.findOne({ token }).lean()

			return {
				status: ResultStatus.Success,
				data: result,
				errorMessage: '',
			}
		} catch (error) {
			return {
				status: ResultStatus.Failure,
				data: undefined,
				errorMessage:
					error instanceof Error ? error.message : 'Unknown error',
			}
		}
	},
}
