import { BlogsModel } from '../../models/blogs.model'
import { newBlogBodyType } from '../dto/input.blog.dto'

export const blogsRepository = {
	async getBlogs() {
		const blogs = await BlogsModel.find().lean()

		const responseBlogs = blogs.map(mapBlogToResponse)

		return responseBlogs
	},

	async getBlogById(id: string) {
		return await BlogsModel.findById(id).lean()
	},

	async addBlog({ description, name, websiteUrl }: newBlogBodyType) {
		const blog = {
			name,
			description,
			websiteUrl,
			createdAt: new Date(),
			isMembership: false,
		}

		await BlogsModel.insertOne(blog)

		return blog
	},

	async updateBlog({
		description,
		name,
		websiteUrl,
		id,
	}: newBlogBodyType & { id: string }) {
		const updatedBlog = await BlogsModel.findByIdAndUpdate(
			id,
			{
				name,
				description,
				websiteUrl,
			},
			{ new: true }
		)

		return updatedBlog
	},

	async deleteBlogById(id: string) {
		const deletedBlog = await BlogsModel.findByIdAndDelete(id)

		return deletedBlog
	},
}

function mapBlogToResponse(blog: any) {
	return {
		id: blog._id ? blog._id.toString() : blog.id,
		name: blog.name,
		description: blog.description,
		websiteUrl: blog.websiteUrl,
		createdAt: blog.createdAt,
		isMembership: blog.isMembership,
	}
}
