import express, { Express } from 'express'
import { testingRouter } from './testRouter/testRouter'
import { blogsRouter } from './blogs/router/blogs.router'
import { postsRouter } from './posts/router/posts.router'
import { authRouter } from './auth/api/router/auth.router'
import { usersRouter } from './users/router/users.router'
import { commentsRouter } from './comments/router/comments.router'
import { emailRouter } from './email/router/email.router'
import cookieParser from 'cookie-parser'

export const setupApp = (app: Express) => {
	app.use(express.json())
	app.use(cookieParser())

	app.set('trust proxy', true)

	app.get('/', (_, res) => {
		res.status(200).send('Hello world!')
	})

	app.use('/api/auth', authRouter)
	app.use('/api/users', usersRouter)
	app.use('/api/blogs', blogsRouter)
	app.use('/api/posts', postsRouter)
	app.use('/api/comments', commentsRouter)
	app.use('/api/testing', testingRouter)
	app.use('/api/email', emailRouter)
}
