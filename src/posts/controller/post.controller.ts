import { Request, Response } from 'express'
import { matchedData } from 'express-validator'
import { CommentQwRepository } from '../../comments/repository/comment.query.repository'
import { CommentService } from '../../comments/services/comment.service'
import { ResultStatus } from '../../core/result/resultStatus'
import { resultCodeToHttpException } from '../../core/result/resultStatusToHttpCode'
import { HttpStatus } from '../../core/types/http-statuses'
import { setDefaultSortAndPaginationIfNotExist } from '../../core/utils/set-default-sort-and-pagination'
import { PostsRepository } from '../repository/posts.repository'
import { PostsService } from '../services/post-service'
import { injectable } from 'inversify'

@injectable()
export class PostController {
	constructor(
		protected postsService: PostsService,
		protected commentService: CommentService,
		protected commentQwRepository: CommentQwRepository,
		protected postsRepository: PostsRepository
	) {
		this.addPostComment = this.addPostComment.bind(this)
	}
	async addPostComment(req: Request, res: Response) {
		const user = req.context!.user!

		const commentDto = {
			postId: req.params.id,
			content: req.body.content,
			commentatorInfo: {
				userId: user.id,
				userLogin: user?.login,
			},
		}

		const result = await this.commentService.addCommentByPostId(commentDto)

		if (result.status === ResultStatus.NotFound) {
			return res.status(HttpStatus.NotFound).send('Post not found')
		}

		if (result.status !== ResultStatus.Success) {
			return res
				.status(resultCodeToHttpException(result.status))
				.send({ errorsMessages: result.extensions })
		}

		const comment = await this.commentQwRepository.findById(result.data!)

		if (comment.status !== ResultStatus.Success) {
			return res
				.status(resultCodeToHttpException(comment.status))
				.send({ errorsMessages: comment.extensions })
		}

		res.status(HttpStatus.Created).send(comment.data)
	}

	getPostComments = async (req: Request, res: Response) => {
		const sanitizedQuery = matchedData(req, {
			locations: ['query'],
			includeOptionals: true,
		})

		const inputQuery = setDefaultSortAndPaginationIfNotExist(sanitizedQuery)

		const postResult = await this.postsRepository.getPostById(req.params.id)

		if (!postResult) {
			return res
				.status(HttpStatus.NotFound)
				.send('Post with this id not found')
		}

		const comments = await this.commentQwRepository.findMany({
			...inputQuery,
			postId: req.params.id,
		})

		if (comments.status !== ResultStatus.Success) {
			return res
				.status(resultCodeToHttpException(comments.status))
				.send({ errorsMessages: comments.extensions })
		}

		res.status(HttpStatus.Success).send(comments.data)
	}

	async getPostsListHandler(req: Request, res: Response) {
		const sanitizedQuery = matchedData(req, {
			locations: ['query'],
			includeOptionals: true,
		})

		const inputQuery = setDefaultSortAndPaginationIfNotExist(sanitizedQuery)

		const posts = await this.postsService.findMany({
			...inputQuery,
		})

		res.status(HttpStatus.Success).send(posts)
	}

	async getPostCommentsHandler(req: Request, res: Response) {
		const sanitizedQuery = matchedData(req, {
			locations: ['query'],
			includeOptionals: true,
		})

		const inputQuery = setDefaultSortAndPaginationIfNotExist(sanitizedQuery)

		const postResult = await this.postsRepository.getPostById(req.params.id)

		if (!postResult) {
			return res
				.status(HttpStatus.NotFound)
				.send('Post with this id not found')
		}

		const comments = await this.commentQwRepository.findMany({
			...inputQuery,
			postId: req.params.id,
		})

		if (comments.status !== ResultStatus.Success) {
			return res
				.status(resultCodeToHttpException(comments.status))
				.send({ errorsMessages: comments.extensions })
		}

		res.status(HttpStatus.Success).send(comments.data)
	}
}
