import { ResolutionVideo } from '../../core/types/resolustioniVideo'

export type InputVideoDto = {
	id: number
	title: string
	author: string
	canBeDownloaded: boolean
	minAgeRestriction: null | number
	createdAt: string // ISO date string
	publicationDate: string // ISO date string
	availableResolutions: ResolutionVideo[]
}
