import { ResolutionVideo } from '../core/types/resolustioniVideo'
import { ValidationError } from '../core/types/validationError'
import { InputVideoDto } from './dto/input.videol-dto'

export const videoInputDtoValidation = (
	data: InputVideoDto,
	update = false
): ValidationError[] => {
	const errors: ValidationError[] = []

	if (
		!data.title ||
		typeof data.title !== 'string' ||
		data.title.trim().length < 2 ||
		data.title.trim().length > 40
	) {
		errors.push({ field: 'title', message: 'Invalid title' })
	}

	if (
		!data.author ||
		typeof data.author !== 'string' ||
		data.author.trim().length < 2 ||
		data.author.trim().length > 20
	) {
		errors.push({ field: 'author', message: 'Invalid author' })
	}

	if (!Array.isArray(data.availableResolutions)) {
		errors.push({
			field: 'availableResolutions',
			message: 'availableResolutions must be array',
		})
	} else if (data.availableResolutions.length) {
		const existingResolutions = Object.values(ResolutionVideo)
		if (
			data.availableResolutions.length > existingResolutions.length ||
			data.availableResolutions.length < 1
		) {
			errors.push({
				field: 'availableResolutions',
				message: 'Invalid availableResolutions',
			})
		}
		for (const resolution of data.availableResolutions) {
			if (!existingResolutions.includes(resolution)) {
				errors.push({
					field: 'availableResolutions',
					message: 'Invalid availableResolutions:' + resolution,
				})
				break
			}
		}
	}

	if (update) {
		if (
			!data.canBeDownloaded ||
			typeof data.canBeDownloaded !== 'boolean'
		) {
			errors.push({
				field: 'canBeDownloaded',
				message: 'Invalid canBeDownloaded',
			})
		}

		if (
			data.minAgeRestriction !== null &&
			(!data.minAgeRestriction ||
				typeof data.minAgeRestriction !== 'number' ||
				data.minAgeRestriction < 1 ||
				data.minAgeRestriction > 18)
		) {
			errors.push({
				field: 'minAgeRestriction',
				message: 'Invalid minAgeRestriction',
			})
		}

		if (!isValidDateTime(data.publicationDate)) {
			errors.push({
				field: 'publicationDate',
				message: 'publicationDate must be a valid ISO date-time string',
			})
		}
	}

	return errors
}

function isValidDateTime(value: string): boolean {
	return typeof value === 'string' && !isNaN(Date.parse(value))
}
