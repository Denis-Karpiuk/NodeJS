import { blogsDB, postsDB } from '../../db/db'
import { newPostBodyType } from '../dto/input.post.dto'

export const postsRepository = {
	getPosts() {
		return postsDB
	},

	getPostById(id: number) {
		return postsDB.find(b => b.id === id)
	},

	addPost(body: newPostBodyType) {
		const lastBlogId = postsDB[postsDB.length - 1]?.id ?? 0

		const blog = blogsDB.find(b => b.id === body.blogId)

		if (!blog) {
			return null
		}

		const blogName = blog?.name || ''

		const post = {
			id: lastBlogId + 1,
			...body,
		}

		postsDB.push({ ...post, blogName })

		return blog
	},

	updatePost({ id, ...body }: newPostBodyType & { id: number }) {
		const updatedBlogIndex = postsDB.findIndex(b => b.id === id)

		if (updatedBlogIndex === -1) {
			return null
		}

		const blog = blogsDB.find(b => b.id === body.blogId)

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

	deletePostById(id: number) {
		const index = postsDB.findIndex(b => b.id === id)
		if (index === -1) {
			return false
		}

		postsDB.splice(index, 1)
		return true
	},
}
