import { InMemoryAnswerAttachmentsRespository } from 'test/repositories/in-memory-answer-attachments-repository'
import { InMemoryAnswersRespository } from 'test/repositories/in-memory-answers-repository'

import { UniqueEntityId } from '@/core/entities/unique-entity-id'

import { AnswwerQuestionUseCase } from './answer-question'

let answerAttachmentsRepository: InMemoryAnswerAttachmentsRespository
let answersRepository: InMemoryAnswersRespository
let sut: AnswwerQuestionUseCase

describe('Create Question', () => {
  beforeEach(() => {
    answerAttachmentsRepository = new InMemoryAnswerAttachmentsRespository()
    answersRepository = new InMemoryAnswersRespository(
      answerAttachmentsRepository,
    )
    sut = new AnswwerQuestionUseCase(answersRepository)
  })

  it('should be able to create an answer', async () => {
    const result = await sut.execute({
      instructorId: '1',
      questionId: '1',
      content: 'Example content of answer',
      attachmentsIds: ['attachment-01', 'attachment-01'],
    })

    expect(result.isRight()).toBe(true)
    expect(answersRepository.items[0].id).toEqual(result.value?.answer.id)
    expect(answersRepository.items[0].attachments.currentItems).toHaveLength(2)
    expect(answersRepository.items[0].attachments.currentItems).toEqual([
      expect.objectContaining({
        attachmentId: new UniqueEntityId('attachment-01'),
      }),
      expect.objectContaining({
        attachmentId: new UniqueEntityId('attachment-01'),
      }),
    ])
  })
})
