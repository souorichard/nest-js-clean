import { makeAnswer } from 'test/factories/make-answer'
import { InMemoryAnswerAttachmentsRespository } from 'test/repositories/in-memory-answer-attachments-repository'
import { InMemoryAnswerCommentsRespository } from 'test/repositories/in-memory-answer-comments-repository'
import { InMemoryAnswersRespository } from 'test/repositories/in-memory-answers-repository'

import { CommnetOnAnswerUseCase } from './comment-on-answer'

let answerAttachmentsRepository: InMemoryAnswerAttachmentsRespository
let answersRepository: InMemoryAnswersRespository
let answerCommentsRepository: InMemoryAnswerCommentsRespository
let sut: CommnetOnAnswerUseCase

describe('Comment On Answer', () => {
  beforeEach(() => {
    answerAttachmentsRepository = new InMemoryAnswerAttachmentsRespository()
    answersRepository = new InMemoryAnswersRespository(
      answerAttachmentsRepository,
    )
    answerCommentsRepository = new InMemoryAnswerCommentsRespository()
    sut = new CommnetOnAnswerUseCase(
      answersRepository,
      answerCommentsRepository,
    )
  })

  it('should be able to comment on answer', async () => {
    const answer = makeAnswer()

    await answersRepository.create(answer)

    const result = await sut.execute({
      answerId: answer.id.toString(),
      authorId: answer.authorId.toString(),
      content: 'Test comment',
    })

    expect(result.isRight()).toBe(true)
    expect(answerCommentsRepository.items[0].content).toEqual('Test comment')
  })
})
