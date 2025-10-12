import { blogsDB } from '../../db/db'
import { newBlogBodyType } from '../dto/input.blog.dto'

export const blogsRepository = {
	getBlogs() {
		return blogsDB
	},

	getBlogById(id: number) {
		return blogsDB.find(b => b.id === id)
	},

	addBlog({ description, name, websiteUrl }: newBlogBodyType) {
		const lastBlogId = blogsDB[blogsDB.length - 1]?.id ?? 0

		const blog = {
			id: lastBlogId + 1,
			name,
			description,
			websiteUrl,
		}

		blogsDB.push(blog)

		return blog
	},

	updateBlog({
		description,
		name,
		websiteUrl,
		id,
	}: newBlogBodyType & { id: number }) {
		const updatedBlogIndex = blogsDB.findIndex(b => b.id === id)

		if (updatedBlogIndex === -1) {
			return null
		}

		blogsDB[updatedBlogIndex] = {
			id,
			name,
			description,
			websiteUrl,
		}

		return blogsDB[updatedBlogIndex]
	},

	deleteBlogById(id: number) {
		const index = blogsDB.findIndex(b => b.id === id)
		if (index === -1) {
			return false
		}

		blogsDB.splice(index, 1)
		return true
	},
}
