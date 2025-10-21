import mongoose from 'mongoose'
import { BlogsModel } from '../../models/blogs.model'
import { newBlogBodyType } from '../dto/input.blog.dto'
import {
	BlogSearchParamsType,
	BlogsSearchResultType,
} from '../service/blog.service'

export type BlogType = {
	id: string
	name: string
	description: string
	websiteUrl: string
	createdAt: string
	isMembership: boolean
}

export const blogsRepository = {
	async findMany({
		pageNumber,
		pageSize,
		searchNameTerm,
		sortBy,
		sortDirection,
	}: BlogSearchParamsType): Promise<BlogsSearchResultType> {
		const skip = (pageNumber - 1) * pageSize
		const findFilter: any = {}

		if (searchNameTerm) {
			findFilter.name = { $regex: searchNameTerm, $options: 'i' }
		}

		const blogs = await BlogsModel.find(findFilter)
			.sort({ [sortBy]: sortDirection === 'asc' ? 1 : -1 })
			.skip(skip)
			.limit(pageSize)
			.lean()

		const totalCount = await BlogsModel.countDocuments(findFilter)

		return {
			pagesCount: Math.ceil(totalCount / pageSize),
			page: pageNumber,
			pageSize,
			totalCount,
			items: blogs.map(mapBlogToResponse),
		}
	},

	async getBlogById(id: string) {
		if (!mongoose.Types.ObjectId.isValid(id)) {
			return null
		}

		const blog = await BlogsModel.findById(id).lean()

		if (!blog) {
			return null
		}

		return mapBlogToResponse(blog)
	},

	async addBlog({ description, name, websiteUrl }: newBlogBodyType) {
		const newBlog = new BlogsModel({
			name,
			description,
			websiteUrl,
			isMembership: false,
		})

		const savedBlog = await newBlog.save()

		return {
			id: savedBlog._id.toString(), // ← добавляем поле id
			name: savedBlog.name,
			description: savedBlog.description,
			websiteUrl: savedBlog.websiteUrl,
			createdAt: savedBlog.createdAt,
			isMembership: savedBlog.isMembership,
		}
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
		if (!mongoose.Types.ObjectId.isValid(id)) {
			return null
		}
		const deletedBlog = await BlogsModel.findByIdAndDelete(id)

		return deletedBlog
	},
}

export function mapBlogToResponse(blog: any): BlogType {
	return {
		id: blog._id ? blog._id.toString() : blog.id,
		name: blog.name,
		description: blog.description,
		websiteUrl: blog.websiteUrl,
		createdAt: blog.createdAt,
		isMembership: blog.isMembership,
	}
}
