import express, { Express } from 'express'
import { videoRouter } from './videos/router/video.router'
import { testingRouter } from './testRouter/testRouter'

export const setupApp = (app: Express) => {
	app.use(express.json()) // middleware для парсинга JSON в теле запроса

	// основной роут
	app.get('/', (req, res) => {
		res.status(200).send('Hello world!')
	})

	app.use('/api/videos', videoRouter)
	app.use('/api/testing', testingRouter)
}
