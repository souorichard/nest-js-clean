import { makeQuestion } from 'test/factories/make-question'
import { InMemoryQuestionAttachmentsRespository } from 'test/repositories/in-memory-question-attachments-repository'
import { InMemoryQuestionCommentsRespository } from 'test/repositories/in-memory-question-comments-repository'
import { InMemoryQuestionsRespository } from 'test/repositories/in-memory-questions-repository'

import { CommnetOnQuestionUseCase } from './comment-on-question'

let questionAttachmentsRepository: InMemoryQuestionAttachmentsRespository
let questionsRepository: InMemoryQuestionsRespository
let questionCommentsRepository: InMemoryQuestionCommentsRespository
let sut: CommnetOnQuestionUseCase

describe('Comment On Question', () => {
  beforeEach(() => {
    questionAttachmentsRepository = new InMemoryQuestionAttachmentsRespository()
    questionsRepository = new InMemoryQuestionsRespository(
      questionAttachmentsRepository,
    )
    questionCommentsRepository = new InMemoryQuestionCommentsRespository()
    sut = new CommnetOnQuestionUseCase(
      questionsRepository,
      questionCommentsRepository,
    )
  })

  it('should be able to comment on question', async () => {
    const question = makeQuestion()

    await questionsRepository.create(question)

    const result = await sut.execute({
      questionId: question.id.toString(),
      authorId: question.authorId.toString(),
      content: 'Test comment',
    })

    expect(result.isRight()).toBe(true)
    expect(questionCommentsRepository.items[0].content).toEqual('Test comment')
  })
})
