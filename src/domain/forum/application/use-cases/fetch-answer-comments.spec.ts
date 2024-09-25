import { makeAnswerComment } from 'test/factories/make-answer-comment'
import { InMemoryAnswerCommentsRespository } from 'test/repositories/in-memory-answer-comments-repository'

import { UniqueEntityId } from '@/core/entities/unique-entity-id'

import { FetchAnswerCommentsUseCase } from './fetch-answer-comments'

let repository: InMemoryAnswerCommentsRespository
let sut: FetchAnswerCommentsUseCase

describe('Fetch Answer Comments', () => {
  beforeEach(() => {
    repository = new InMemoryAnswerCommentsRespository()
    sut = new FetchAnswerCommentsUseCase(repository)
  })

  it('should be able to fetch answer comments', async () => {
    await repository.create(
      makeAnswerComment({ answerId: new UniqueEntityId('answer-01') }),
    )
    await repository.create(
      makeAnswerComment({ answerId: new UniqueEntityId('answer-01') }),
    )
    await repository.create(
      makeAnswerComment({ answerId: new UniqueEntityId('answer-01') }),
    )

    const result = await sut.execute({
      answerId: 'answer-01',
      page: 1,
    })

    expect(result.isRight()).toBe(true)
    expect(result.value?.answerComments).toHaveLength(3)
  })

  it('should be able to fetch paginated answer comments', async () => {
    for (let i = 1; i <= 22; i++) {
      await repository.create(
        makeAnswerComment({ answerId: new UniqueEntityId('answer-01') }),
      )
    }

    const result = await sut.execute({
      answerId: 'answer-01',
      page: 2,
    })

    expect(result.isRight()).toBe(true)
    expect(result.value?.answerComments).toHaveLength(2)
  })
})
