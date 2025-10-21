import mongoose from 'mongoose'
import { PostsModel } from '../../models/posts.model'
import { newPostBodyType } from '../dto/input.post.dto'
import { BlogsModel } from '../../models/blogs.model'
import { SortDirection } from '../../core/types/sort-direction'

export const postsRepository = {
	async findMany({
		pageNumber,
		pageSize,
		sortBy,
		sortDirection,
		blogId,
	}: any): Promise<any> {
		const skip = (pageNumber - 1) * pageSize

		const findFilter: any = {}

		if (blogId) {
			findFilter.blogId = blogId
		}

		const posts = await PostsModel.find(findFilter)
			.sort({
				[sortBy]: sortDirection === 'asc' ? 1 : -1,
			})
			.skip(skip)
			.limit(pageSize)
			.lean()

		const totalCount = await PostsModel.countDocuments(findFilter)

		return {
			pagesCount: Math.ceil(totalCount / pageSize),
			page: pageNumber,
			pageSize,
			totalCount,
			items: posts.map(mapPostToResponse),
		}
	},

	async getPostById(id: string) {
		if (!mongoose.Types.ObjectId.isValid(id)) {
			return null
		}

		const post = await PostsModel.findById(id)

		return mapPostToResponse(post)
	},

	async addPost(body: newPostBodyType) {
		const blog = await BlogsModel.findById(body.blogId).lean()

		if (!blog) {
			return null
		}

		const newPost = new PostsModel({
			title: body.title,
			shortDescription: body.shortDescription,
			content: body.content,
			blogId: body.blogId,
			blogName: blog.name,
		})

		const savedPost = await newPost.save()

		return {
			id: savedPost._id.toString(),
			title: savedPost.title,
			shortDescription: savedPost.shortDescription,
			content: savedPost.content,
			blogId: savedPost.blogId,
			blogName: savedPost.blogName,
			createdAt: savedPost.createdAt,
		}
	},

	async updatePost({ id, ...body }: newPostBodyType & { id: string }) {
		const updatedPost = PostsModel.findByIdAndUpdate(id, body)

		return updatedPost
	},

	async deletePostById(id: string) {
		const deletedPost = await PostsModel.findByIdAndDelete(id)
		if (!deletedPost) {
			return false
		}

		return true
	},
}

// Вспомогательная функция для постов
function mapPostToResponse(post: any) {
	if (!post) {
		return null
	}

	return {
		id: post._id ? post._id.toString() : post.id,
		title: post.title,
		shortDescription: post.shortDescription,
		content: post.content,
		blogId: post.blogId,
		blogName: post.blogName,
		createdAt: post.createdAt,
	}
}
