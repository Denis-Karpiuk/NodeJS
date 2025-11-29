import { WithId } from 'mongodb'
import { Result } from '../../core/result/result.type'
import { ResultStatus } from '../../core/result/resultStatus'
import { CommentModel } from '../../models/comments.model'
import { CommentDbType } from '../types/comment.db.type'
import { CommentViewType } from '../types/comment.view.type'
import { PaginationAndSorting } from '../../core/types/pagination-and-sorting'
import { PaginationType } from '../../core/types/pagination.type'
import { skipItems } from '../../core/utils/skipItmes'
import { SortDirection } from '../../core/types/sort-direction'
import { pagesCount } from '../../core/utils/pagesCount'
import { injectable } from 'inversify'

@injectable()
export class CommentQwRepository {
	async findById(id: string): Promise<Result<CommentViewType>> {
		try {
			const comment = await CommentModel.findById(id).lean()

			if (!comment) {
				return {
					status: ResultStatus.NotFound,
					data: undefined,
					errorMessage: 'Комментарий не найден',
				}
			}

			return {
				status: ResultStatus.Success,
				data: mapCommentFromDbToView(comment),
				errorMessage: '',
			}
		} catch (error) {
			return {
				status: ResultStatus.Failure,
				data: undefined,
				errorMessage:
					error instanceof Error ? error.message : 'Unknown error',
			}
		}
	}

	async findMany({
		pageNumber,
		pageSize,
		sortBy,
		sortDirection,
		postId,
	}: PaginationAndSorting<string> & { postId: string }): Promise<
		Result<PaginationType<CommentViewType[]>>
	> {
		try {
			const skip = skipItems(pageNumber, pageSize)
			const findFilter = { postId }

			const comments = await CommentModel.find(findFilter)
				.sort({
					[sortBy]: sortDirection === SortDirection.Asc ? 1 : -1,
				})
				.skip(skip)
				.limit(pageSize)
				.lean()

			const totalCount = await CommentModel.countDocuments(findFilter)

			return {
				status: ResultStatus.Success,
				data: {
					pagesCount: pagesCount(totalCount, pageSize),
					page: pageNumber,
					pageSize,
					totalCount,
					items: comments.map(mapCommentFromDbToView),
				},
				errorMessage: '',
			}
		} catch (error) {
			return {
				status: ResultStatus.Failure,
				data: undefined,
				errorMessage:
					error instanceof Error ? error.message : 'Unknown error',
			}
		}
	}
}

export function mapCommentFromDbToView(
	data: WithId<CommentDbType>
): CommentViewType {
	return {
		id: data._id.toString(),
		content: data.content,
		commentatorInfo: {
			userId: data.commentatorInfo.userId,
			userLogin: data.commentatorInfo.userLogin,
		},
		createdAt: data.createdAt,
	}
}
