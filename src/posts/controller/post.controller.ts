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
import { CommentsLikeService } from '../../likes/servece/comments.like.service'

@injectable()
export class PostController {
	constructor(
		protected postsService: PostsService,
		protected commentService: CommentService,
		protected commentQwRepository: CommentQwRepository,
		protected postsRepository: PostsRepository,
		protected commentLikeService: CommentsLikeService
	) {
		this.addPostComment = this.addPostComment.bind(this)
		this.getPostComments = this.getPostComments.bind(this)
		this.getPostsList = this.getPostsList.bind(this)
		this.getPostById = this.getPostById.bind(this)
		this.addPost = this.addPost.bind(this)
		this.updatePostById = this.updatePostById.bind(this)
		this.addLikeStatusToPost = this.addLikeStatusToPost.bind(this)
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

		const commentId = result.data!

		const comment = await this.commentQwRepository.findById(commentId)

		if (comment.status !== ResultStatus.Success) {
			return res
				.status(resultCodeToHttpException(comment.status))
				.send({ errorsMessages: comment.extensions })
		}

		const commentLikeInfo =
			await this.commentLikeService.getCommentsLikesInfo(
				commentId,
				user.id
			)

		if (commentLikeInfo.status !== ResultStatus.Success) {
			return res
				.status(resultCodeToHttpException(commentLikeInfo.status))
				.send({ errorsMessages: commentLikeInfo.extensions })
		}

		const addedPostResult = {
			...comment.data,
			likesInfo: commentLikeInfo.data!,
		}

		res.status(HttpStatus.Created).send(addedPostResult)
	}

	async getPostsList(req: Request, res: Response) {
		const sanitizedQuery = matchedData(req, {
			locations: ['query'],
			includeOptionals: true,
		})

		const inputQuery = setDefaultSortAndPaginationIfNotExist(sanitizedQuery)

		const posts = await this.postsService.findMany({
			...inputQuery,
		})

		if (!posts) {
			res.status(HttpStatus.NotFound).send('Posts not found')
		}

		const preparePostsItems = await Promise.all(
			posts.items.map(async (post: any) => {
				const likeInfoResult =
					await this.commentLikeService.getPostsLikesInfo(
						post.id,
						req.context?.user?.id
					)
				if (likeInfoResult.status === ResultStatus.NotFound) {
					return {
						status: ResultStatus.NotFound,
						extensions: [
							{ field: 'id', message: 'Comment not found' },
						],
						data: null,
					}
				}
				return { ...post, extendedLikesInfo: likeInfoResult.data }
			})
		)

		res.status(HttpStatus.Success).send({
			...posts,
			items: preparePostsItems,
		})
	}

	async getPostById(req: Request, res: Response) {
		const id = req.params.id
		const user = req.context?.user

		const post = await this.postsRepository.getPostById(id)
		if (!post) {
			res.status(HttpStatus.NotFound).send('Post not found')
		}

		const likeInfoResult = await this.commentLikeService.getPostsLikesInfo(
			req.params.id,
			user?.id
		)

		if (likeInfoResult.status === ResultStatus.NotFound) {
			return {
				status: ResultStatus.NotFound,
				extensions: [{ field: 'id', message: 'Comment not found' }],
				data: null,
			}
		}

		const result = { ...post, extendedLikesInfo: likeInfoResult.data }

		res.status(HttpStatus.Success).send(result)
	}

	async getPostComments(req: Request, res: Response) {
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

		const user = req.context?.user

		// Собираем массив с лайками
		const itemsWithLikes = await Promise.all(
			comments.data?.items.map(async element => {
				const commentLikeInfo =
					await this.commentLikeService.getCommentsLikesInfo(
						element.id,
						user?.id
					)
				return {
					...element,
					likesInfo: commentLikeInfo.data,
				}
			}) ?? []
		)

		res.status(HttpStatus.Success).send({
			...comments.data,
			items: itemsWithLikes,
		})
	}

	async addPost(req: Request, res: Response) {
		const result = await this.postsRepository.addPost(req.body)

		if (!result) {
			res.status(HttpStatus.NotFound).send('Blog not found')
		}

		const postLikesInfo = await this.commentLikeService.getPostsLikesInfo(
			result!.id,
			req.context?.user?.id
		)

		res.status(HttpStatus.Created).send({
			...result,
			extendedLikesInfo: postLikesInfo.data,
		})
	}

	async updatePostById(req: Request, res: Response) {
		const updateResult = await this.postsRepository.updatePost({
			...req.body,
			id: req.params.id,
		})

		if (!updateResult) {
			res.status(HttpStatus.NotFound).send('Post not found')
		}

		res.status(HttpStatus.NoContent).send(
			`Post ${req.params.id} was updated successfully`
		)
	}

	async deletePostById(req: Request, res: Response) {
		const result = await this.postsRepository.deletePostById(req.params.id)

		if (!result) {
			res.status(HttpStatus.NotFound).send('Post not found')
		}

		res.status(HttpStatus.NoContent).send(
			`Post ${req.params.id} was deleted`
		)
	}

	async addLikeStatusToPost(req: Request, res: Response) {
		const id = req.params.id
		const body = req.body
		const user = req.context!.user!

		const result = await this.commentLikeService.addLikeToPost({
			id,
			...body,
			userId: user.id,
		})

		if (result.status !== ResultStatus.Success) {
			return res
				.status(resultCodeToHttpException(result.status))
				.send({ errorsMessages: result.extensions })
		}
		res.status(HttpStatus.NoContent).send(result.data)
	}
}
