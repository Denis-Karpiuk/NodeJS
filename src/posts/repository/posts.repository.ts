import { BlogsModel } from '../../models/blogs.model'
import { PostsModel } from '../../models/posts.model'
import { newPostBodyType } from '../dto/input.post.dto'

export const postsRepository = {
	async getPosts() {
		const posts = await PostsModel.find().lean()

		const responsePosts = posts.map(mapPostToResponse)

		return responsePosts
	},

	async getPostById(id: string) {
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
			id: savedPost._id.toString(), // ← добавляем поле id
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
