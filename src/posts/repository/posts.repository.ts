import { BlogsModel } from '../../models/blogs.model'
import { PostsModel } from '../../models/posts.model'
import { newPostBodyType } from '../dto/input.post.dto'

export const postsRepository = {
	async getPosts() {
		return await PostsModel.find()
	},

	async getPostById(id: string) {
		return await PostsModel.findById(id)
	},

	async addPost(body: newPostBodyType) {
		console.log(body.blogId)

		const blog = await BlogsModel.findById(body.blogId).lean()

		if (!blog) {
			return null
		}

		const post = {
			...body,
			blogName: blog.name || '',
		}

		await PostsModel.insertOne(post)

		return post
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
