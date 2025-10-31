import { HttpStatus } from '../types/http-statuses'
import { ResultStatus } from './resultStatus'

export const resultCodeToHttpException = (resultCode: ResultStatus): number => {
	switch (resultCode) {
		case ResultStatus.BadRequest:
			return HttpStatus.BadRequest

		case ResultStatus.Forbidden:
			return HttpStatus.Forbidden

		case ResultStatus.Unauthorized:
			return HttpStatus.Unauthorized

		default:
			return HttpStatus.InternalServerError
	}
}
