import express, { Express } from 'express'
import { videoRouter } from './videos/router/video.router'
import { testingRouter } from './testRouter/testRouter'
import { blogsRouter } from './blogs/router/blogs.router'
import { postsRouter } from './posts/router/posts.router'
import { authRouter } from './auth/api/router/auth.router'
import { usersRouter } from './users/router/users.router'
import { commentsRouter } from './comments/router/comments.router'
import { emailRouter } from './email/router/email.router'

export const setupApp = (app: Express) => {
	app.use(express.json()) // middleware для парсинга JSON в теле запроса

	// основной роут
	app.get('/', (_, res) => {
		res.status(200).send('Hello world!')
	})

	app.use('/api/auth', authRouter)
	app.use('/api/users', usersRouter)
	app.use('/api/videos', videoRouter)
	app.use('/api/blogs', blogsRouter)
	app.use('/api/posts', postsRouter)
	app.use('/api/comments', commentsRouter)
	app.use('/api/testing', testingRouter)
	app.use('/api/email', emailRouter)
}
