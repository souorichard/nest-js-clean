import { makeQuestionComment } from 'test/factories/make-question-comment'
import { InMemoryQuestionCommentsRespository } from 'test/repositories/in-memory-question-comments-repository'

import { UniqueEntityId } from '@/core/entities/unique-entity-id'

import { FetchQuestionCommentsUseCase } from './fetch-question-comments'

let repository: InMemoryQuestionCommentsRespository
let sut: FetchQuestionCommentsUseCase

describe('Fetch Question Comments', () => {
  beforeEach(() => {
    repository = new InMemoryQuestionCommentsRespository()
    sut = new FetchQuestionCommentsUseCase(repository)
  })

  it('should be able to fetch question comments', async () => {
    await repository.create(
      makeQuestionComment({ questionId: new UniqueEntityId('question-01') }),
    )
    await repository.create(
      makeQuestionComment({ questionId: new UniqueEntityId('question-01') }),
    )
    await repository.create(
      makeQuestionComment({ questionId: new UniqueEntityId('question-01') }),
    )

    const result = await sut.execute({
      questionId: 'question-01',
      page: 1,
    })

    expect(result.isRight()).toBe(true)
    expect(result.value?.questionComments).toHaveLength(3)
  })

  it('should be able to fetch paginated question comments', async () => {
    for (let i = 1; i <= 22; i++) {
      await repository.create(
        makeQuestionComment({ questionId: new UniqueEntityId('question-01') }),
      )
    }

    const result = await sut.execute({
      questionId: 'question-01',
      page: 2,
    })

    expect(result.isRight()).toBe(true)
    expect(result.value?.questionComments).toHaveLength(2)
  })
})
