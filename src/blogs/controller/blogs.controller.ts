import { Request, Response } from 'express'
import { HttpStatus } from '../../core/types/http-statuses'
import { PostsService } from '../../posts/services/post-service'
import { BlogsRepository } from '../repository/blogs.mongo.repository'
import { matchedData } from 'express-validator'
import { setDefaultSortAndPaginationIfNotExist } from '../../core/utils/set-default-sort-and-pagination'
import { BlogsService } from '../service/blog.service'
import { injectable } from 'inversify'

@injectable()
export class BlogsController {
	constructor(
		protected blogsRepository: BlogsRepository,
		protected postsService: PostsService,
		protected blogsService: BlogsService
	) {
		this.addPostsByBlogId = this.addPostsByBlogId.bind(this)
		this.getBlogsList = this.getBlogsList.bind(this)
		this.getPostsByBlogId = this.getPostsByBlogId.bind(this)
		this.deleteBlogById = this.deleteBlogById.bind(this)
		this.updateBlogById = this.updateBlogById.bind(this)
		this.getBlogById = this.getBlogById.bind(this)
		this.addBlog = this.addBlog.bind(this)
	}

	async addPostsByBlogId(req: Request, res: Response) {
		const blogId = req.params.id

		const blog = await this.blogsRepository.getBlogById(req.params.id)

		if (!blog) {
			res.status(HttpStatus.NotFound).send('Blog not found')
			return
		}

		const result = await this.postsService.createPost({
			...req.body,
			blogId,
		})

		if (!result) {
			res.status(HttpStatus.NotFound).send('Blog not found')
		}

		res.status(HttpStatus.Created).send(result)
	}

	async getPostsByBlogId(req: Request, res: Response) {
		const sanitizedQuery = matchedData(req, {
			locations: ['query'],
			includeOptionals: true,
		})

		const blogId = req.params.id

		const blog = await this.blogsRepository.getBlogById(blogId)

		if (!blog) {
			res.status(HttpStatus.NotFound).send('Blog not found')
			return
		}

		const inputQuery = setDefaultSortAndPaginationIfNotExist(sanitizedQuery)

		const posts = await this.postsService.findMany({
			...inputQuery,
			blogId,
		})

		if (!posts) {
			res.status(HttpStatus.NotFound).send('Blog not found')
		}

		res.status(HttpStatus.Success).send(posts)
	}

	async getBlogsList(req: Request, res: Response) {
		const sanitizedQuery = matchedData(req, {
			locations: ['query'],
			includeOptionals: true,
		})

		const inputQuery = setDefaultSortAndPaginationIfNotExist(sanitizedQuery)

		const blogs = await this.blogsService.findMany({
			...inputQuery,
			searchNameTerm: sanitizedQuery.searchNameTerm,
		})

		res.status(HttpStatus.Success).send(blogs)
	}

	async deleteBlogById(req: Request, res: Response) {
		const result = await this.blogsRepository.deleteBlogById(req.params.id)

		if (!result) {
			res.status(HttpStatus.NotFound).send('Blog not found')
		}

		res.status(HttpStatus.NoContent).send(
			`Blog ${req.params.id} was deleted`
		)
	}

	async updateBlogById(req: Request, res: Response) {
		const updateResult = await this.blogsRepository.updateBlog({
			...req.body,
			id: req.params.id,
		})

		if (!updateResult) {
			res.status(HttpStatus.NotFound).send('Blog not found')
		}

		res.status(HttpStatus.NoContent).send(
			`Blog ${req.params.id} was updated successfully`
		)
	}

	async addBlog(req: Request, res: Response) {
		const result = await this.blogsRepository.addBlog(req.body)

		res.status(HttpStatus.Created).send(result)
	}

	async getBlogById(req: Request, res: Response) {
		const blog = await this.blogsRepository.getBlogById(req.params.id)

		if (!blog) {
			res.status(HttpStatus.NotFound).send('Blog not found')
		}

		res.status(HttpStatus.Success).send(blog)
	}
}
