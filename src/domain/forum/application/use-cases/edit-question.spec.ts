import { makeQuestion } from 'test/factories/make-question'
import { makeQuestionAttachment } from 'test/factories/make-question-attachment'
import { InMemoryQuestionAttachmentsRespository } from 'test/repositories/in-memory-question-attachments-repository'
import { InMemoryQuestionsRespository } from 'test/repositories/in-memory-questions-repository'

import { UniqueEntityId } from '@/core/entities/unique-entity-id'
import { NotAllowedError } from '@/core/errors/not-allowed-error'

import { EditQuestionUseCase } from './edit-question'

let questionAttachmentsRepository: InMemoryQuestionAttachmentsRespository
let questionsRepository: InMemoryQuestionsRespository
let sut: EditQuestionUseCase

describe('Edit Question', () => {
  beforeEach(() => {
    questionAttachmentsRepository = new InMemoryQuestionAttachmentsRespository()
    questionsRepository = new InMemoryQuestionsRespository(
      questionAttachmentsRepository,
    )
    sut = new EditQuestionUseCase(
      questionsRepository,
      questionAttachmentsRepository,
    )
  })

  it('should be able to edit a question', async () => {
    const newQuestion = makeQuestion(
      {
        authorId: new UniqueEntityId('author-01'),
      },
      new UniqueEntityId('question-01'),
    )

    await questionsRepository.create(newQuestion)

    questionAttachmentsRepository.items.push(
      makeQuestionAttachment({
        questionId: newQuestion.id,
        attachmentId: new UniqueEntityId('attachment-01'),
      }),
      makeQuestionAttachment({
        questionId: newQuestion.id,
        attachmentId: new UniqueEntityId('attachment-02'),
      }),
    )

    const result = await sut.execute({
      questionId: 'question-01',
      authorId: 'author-01',
      title: 'Test title',
      content: 'Test content',
      attachmentsIds: ['attachment-01', 'attachment-03'],
    })

    expect(result.isRight()).toBe(true)
    expect(questionsRepository.items[0]).toMatchObject({
      title: 'Test title',
      content: 'Test content',
    })
    expect(questionsRepository.items[0].attachments.currentItems).toHaveLength(
      2,
    )
    expect(questionsRepository.items[0].attachments.currentItems).toEqual([
      expect.objectContaining({
        attachmentId: new UniqueEntityId('attachment-01'),
      }),
      expect.objectContaining({
        attachmentId: new UniqueEntityId('attachment-03'),
      }),
    ])
  })

  it('should not be able to edit a question from another user', async () => {
    const newQuestion = makeQuestion(
      {
        authorId: new UniqueEntityId('author-01'),
      },
      new UniqueEntityId('question-01'),
    )

    await questionsRepository.create(newQuestion)

    const result = await sut.execute({
      questionId: newQuestion.id.toString(),
      authorId: 'author-02',
      title: 'Test title',
      content: 'Test content',
      attachmentsIds: [],
    })

    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(NotAllowedError)
  })
})
