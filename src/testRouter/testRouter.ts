import { Router, Response } from 'express'
import { blogsDB, db, postsDB } from '../db/db'
import { HttpStatus } from '../core/types/http-statuses'
import { BlogsModel } from '../models/blogs.model'
import { PostsModel } from '../models/posts.model'
import { UsersModel } from '../models/users.model'
import { CommentModel } from '../models/comments.model'

export const testingRouter = Router({})

testingRouter.delete('/all-data', async (_, res: Response) => {
	db.length = 0
	blogsDB.length = 0
	postsDB.length = 0

	await BlogsModel.deleteMany({})
	await PostsModel.deleteMany({})
	await UsersModel.deleteMany({})
	await CommentModel.deleteMany({})

	res.sendStatus(HttpStatus.NoContent)
})
