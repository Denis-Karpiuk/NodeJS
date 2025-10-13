import { blogsDB } from '../../db/db'
import { newBlogBodyType } from '../dto/input.blog.dto'

export const blogsRepository = {
	getBlogs() {
		return blogsDB
	},

	getBlogById(id: string) {
		return blogsDB.find(b => String(b.id) === String(id))
	},

	addBlog({ description, name, websiteUrl }: newBlogBodyType) {
		const lastBlogId = blogsDB[blogsDB.length - 1]?.id ?? 0

		const newBlogId = String(Number(lastBlogId) + 1)

		const blog = {
			id: newBlogId,
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
	}: newBlogBodyType & { id: string }) {
		const updatedBlogIndex = blogsDB.findIndex(
			b => String(b.id) === String(id)
		)

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

	deleteBlogById(id: string) {
		const index = blogsDB.findIndex(b => String(b.id) === String(id))
		if (index === -1) {
			return false
		}

		blogsDB.splice(index, 1)
		return true
	},
}
