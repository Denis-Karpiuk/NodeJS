import express, { Express } from 'express'
import { videoRouter } from './videos/router/video.router'
import { testingRouter } from './testRouter/testRouter'
import { blogsRouter } from './blogs/router/blogs.router'

export const setupApp = (app: Express) => {
	app.use(express.json()) // middleware для парсинга JSON в теле запроса

	// основной роут
	app.get('/', (_, res) => {
		res.status(200).send('Hello world!')
	})

	app.use('/api/videos', videoRouter)
	app.use('/api/blogs', blogsRouter)
	app.use('/api/testing', testingRouter)
}
