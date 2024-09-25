import { makeAnswer } from 'test/factories/make-answer'
import { makeQuestion } from 'test/factories/make-question'
import { InMemoryAnswerAttachmentsRespository } from 'test/repositories/in-memory-answer-attachments-repository'
import { InMemoryAnswersRespository } from 'test/repositories/in-memory-answers-repository'
import { InMemoryQuestionAttachmentsRespository } from 'test/repositories/in-memory-question-attachments-repository'
import { InMemoryQuestionsRespository } from 'test/repositories/in-memory-questions-repository'

import { UniqueEntityId } from '@/core/entities/unique-entity-id'

import { ChooseQuestionBestAnswerUseCase } from './choose-question-best-answer'

let questionAttachmentsRepository: InMemoryQuestionAttachmentsRespository
let answerAttachmentsRepository: InMemoryAnswerAttachmentsRespository
let questionsRepository: InMemoryQuestionsRespository
let answersRepository: InMemoryAnswersRespository
let sut: ChooseQuestionBestAnswerUseCase

describe('Choose Question Best Answer', () => {
  beforeEach(() => {
    questionAttachmentsRepository = new InMemoryQuestionAttachmentsRespository()
    answerAttachmentsRepository = new InMemoryAnswerAttachmentsRespository()
    questionsRepository = new InMemoryQuestionsRespository(
      questionAttachmentsRepository,
    )
    answersRepository = new InMemoryAnswersRespository(
      answerAttachmentsRepository,
    )
    sut = new ChooseQuestionBestAnswerUseCase(
      questionsRepository,
      answersRepository,
    )
  })

  it('should be able to choose question best answer', async () => {
    const question = makeQuestion()

    const answer = makeAnswer({
      questionId: question.id,
    })

    await questionsRepository.create(question)
    await answersRepository.create(answer)

    const result = await sut.execute({
      answerId: answer.id.toString(),
      authorId: question.authorId.toString(),
    })

    expect(result.isRight()).toBe(true)
    expect(questionsRepository.items[0].bestAnswerId).toEqual(answer.id)
  })

  it('should not be able to choose another user question best answer', async () => {
    const question = makeQuestion({
      authorId: new UniqueEntityId('author-01'),
    })

    const answer = makeAnswer({
      questionId: question.id,
    })

    await questionsRepository.create(question)
    await answersRepository.create(answer)

    const result = await sut.execute({
      answerId: answer.id.toString(),
      authorId: 'author-02',
    })

    expect(result.isLeft()).toBe(true)
  })
})
