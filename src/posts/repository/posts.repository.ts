import { blogsDB, postsDB } from '../../db/db'
import { newPostBodyType } from '../dto/input.post.dto'

export const postsRepository = {
	getPosts() {
		return postsDB
	},

	getPostById(id: string) {
		return postsDB.find(b => String(b.id) === String(id))
	},

	addPost(body: newPostBodyType) {
		const lastPostId = postsDB[postsDB.length - 1]?.id ?? 0

		const blog = blogsDB.find(b => String(b.id) === String(body.blogId))

		if (!blog) {
			return null
		}

		const blogName = blog?.name || ''

		const newPostId = String(Number(lastPostId) + 1)

		const post = {
			id: newPostId,
			...body,
		}

		postsDB.push({ ...post, blogName })

		return blog
	},

	updatePost({ id, ...body }: newPostBodyType & { id: string }) {
		const updatedBlogIndex = postsDB.findIndex(
			b => String(b.id) === String(id)
		)

		if (updatedBlogIndex === -1) {
			return null
		}

		const blog = blogsDB.find(b => String(b.id) === String(body.blogId))

		if (!blog) {
			return null
		}

		postsDB[updatedBlogIndex] = {
			id,
			blogName: blog.name,
			...body,
		}

		return postsDB[updatedBlogIndex]
	},

	deletePostById(id: string) {
		const index = postsDB.findIndex(b => b.id === id)
		if (index === -1) {
			return false
		}

		postsDB.splice(index, 1)
		return true
	},
}
