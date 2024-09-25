import { makeQuestionComment } from 'test/factories/make-question-comment'
import { InMemoryQuestionCommentsRespository } from 'test/repositories/in-memory-question-comments-repository'

import { UniqueEntityId } from '@/core/entities/unique-entity-id'
import { NotAllowedError } from '@/core/errors/not-allowed-error'

import { DeleteQuestionCommentUseCase } from './delete-question-comment'

let questionCommentsRepository: InMemoryQuestionCommentsRespository
let sut: DeleteQuestionCommentUseCase

describe('Delete Question Comment', () => {
  beforeEach(() => {
    questionCommentsRepository = new InMemoryQuestionCommentsRespository()
    sut = new DeleteQuestionCommentUseCase(questionCommentsRepository)
  })

  it('should be able to delete a question comment', async () => {
    const questionComment = makeQuestionComment()

    await questionCommentsRepository.create(questionComment)

    const result = await sut.execute({
      authorId: questionComment.authorId.toString(),
      questionCommentId: questionComment.id.toString(),
    })

    expect(result.isRight()).toBe(true)
    expect(questionCommentsRepository.items).toHaveLength(0)
  })

  it('should not be able to delete from another user question comment', async () => {
    const questionComment = makeQuestionComment({
      authorId: new UniqueEntityId('author-01'),
    })

    await questionCommentsRepository.create(questionComment)

    const result = await sut.execute({
      authorId: 'author-02',
      questionCommentId: questionComment.id.toString(),
    })

    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(NotAllowedError)
  })
})
