import { InputVideoDto } from './../dto/input.videol-dto'
import { Request, Response, Router } from 'express'
import { db } from '../../db/db'
import { HttpStatus } from '../../core/types/http-statuses'
import { createErrorMessages } from '../../core/utils/createError'
import { videoInputDtoValidation } from '../videoInputDtoValidation'

export const videoRouter = Router({})

videoRouter
	.get('', (_, res: Response) => {
		res.status(HttpStatus.Ok).send(db)
	})

	.get('/:id', (req: Request, res: Response) => {
		const id = parseInt(req.params.id)
		const video = db.find(d => d.id === id)

		if (!video) {
			res.status(HttpStatus.NotFound).send(
				createErrorMessages([
					{ field: 'id', message: 'Video not found' },
				])
			)
			return
		}
		res.status(200).send(video)
	})

	.post('', (req: Request<{}, {}, InputVideoDto>, res: Response) => {
		const errors = videoInputDtoValidation(req.body)

		if (errors.length > 0) {
			res.status(HttpStatus.BadRequest).send(createErrorMessages(errors))
			return
		}

		const defaultDate = new Date(
			Date.now() + 24 * 60 * 60 * 1000
		).toISOString()

		const newVideo: InputVideoDto = {
			id: db.length ? db[db.length - 1].id + 1 : 1,
			title: req.body.title,
			author: req.body.author,
			canBeDownloaded: false,
			minAgeRestriction: null,
			createdAt: defaultDate,
			publicationDate: defaultDate,
			availableResolutions: req.body.availableResolutions,
		}

		db.push(newVideo)

		res.status(HttpStatus.Created).send(newVideo)
	})

	.put(
		'/:id',
		(req: Request<{ id: string }, {}, InputVideoDto>, res: Response) => {
			const id = parseInt(req.params.id)
			const index = db.findIndex(v => v.id === id)

			if (index === -1) {
				res.status(HttpStatus.NotFound).send(
					createErrorMessages([
						{ field: 'id', message: 'Video not found' },
					])
				)
				return
			}

			const errors = videoInputDtoValidation(req.body, true)

			if (errors.length > 0) {
				res.status(HttpStatus.BadRequest).send(
					createErrorMessages(errors)
				)
				return
			}

			const video = db[index]

			video.title = req.body.title
			video.author = req.body.author
			video.canBeDownloaded = req.body.canBeDownloaded
			video.minAgeRestriction = req.body.minAgeRestriction
			video.availableResolutions = req.body.availableResolutions
			video.publicationDate = req.body.publicationDate

			res.sendStatus(HttpStatus.NoContent)
		}
	)

	.delete('/:id', (req: Request, res: Response) => {
		const id = parseInt(req.params.id)

		//ищет первый элемент, у которого функция внутри возвращает true и возвращает индекс этого элемента в массиве, если id ни у кого не совпал, то findIndex вернёт -1.
		const index = db.findIndex(v => v.id === id)

		if (index === -1) {
			res.status(HttpStatus.NotFound).send(
				createErrorMessages([
					{ field: 'id', message: 'Video not found' },
				])
			)
			return
		}

		db.splice(index, 1)
		res.sendStatus(HttpStatus.NoContent)
	})
