import { Router, Response } from 'express'
import { HttpStatus } from '../core/types/http-statuses'
import { BlogsModel } from '../models/blogs.model'
import { PostsModel } from '../models/posts.model'
import { UsersModel } from '../models/users.model'
import { CommentModel } from '../models/comments.model'
import { SecurityModel } from '../models/security.model'

export const testingRouter = Router({})

testingRouter.delete('/all-data', async (_, res: Response) => {
	await BlogsModel.deleteMany({})
	await PostsModel.deleteMany({})
	await UsersModel.deleteMany({})
	await CommentModel.deleteMany({})
	await SecurityModel.deleteMany({})

	res.sendStatus(HttpStatus.NoContent)
})
