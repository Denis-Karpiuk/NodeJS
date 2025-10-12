export type InputBlogDto = {
	id: string
	name: string
	description: string
	websiteUrl: string
}

export type newBlogBodyType = Omit<InputBlogDto, 'id'>
