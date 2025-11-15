import { ResultStatus } from './resultStatus'

export type Result<T = null> = {
	status: ResultStatus
	errorMessage?: string
	extensions?: ExtensionType[]
	data?: T
}

type ExtensionType = {
	field: string | null
	message: string
}
