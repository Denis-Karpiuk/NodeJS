export type InputBlogDto = {
	id: number
	name: string
	description: string
	websiteUrl: string
}

export type newBlogBodyType = Omit<InputBlogDto, 'id'>
