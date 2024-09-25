import { makeAnswer } from 'test/factories/make-answer'
import { makeQuestion } from 'test/factories/make-question'
import { InMemoryAnswerAttachmentsRespository } from 'test/repositories/in-memory-answer-attachments-repository'
import { InMemoryAnswersRespository } from 'test/repositories/in-memory-answers-repository'
import { InMemoryNotificationsRepository } from 'test/repositories/in-memory-notifications-repository'
import { InMemoryQuestionAttachmentsRespository } from 'test/repositories/in-memory-question-attachments-repository'
import { InMemoryQuestionsRespository } from 'test/repositories/in-memory-questions-repository'
import { waitFor } from 'test/utils/wait-for'
import { MockInstance } from 'vitest'

import {
  SendNotificationUseCase,
  SendNotificationUseCaseRequest,
  SendNotificationUseCaseResponse,
} from '../use-cases/send-notification'
import { OnQuestionBestAnswerChosen } from './on-question-best-answer-chosen'

let questionAttachmentsRepository: InMemoryQuestionAttachmentsRespository
let questionsRepository: InMemoryQuestionsRespository
let answerAttachmentsRepository: InMemoryAnswerAttachmentsRespository
let answersRepository: InMemoryAnswersRespository
let notificationsRepository: InMemoryNotificationsRepository
let sendNotificationUseCase: SendNotificationUseCase

let sendNotificationExecuteSpy: MockInstance<
  (
    request: SendNotificationUseCaseRequest
  ) => Promise<SendNotificationUseCaseResponse>
>

describe('On Question Best Answer Chosen', () => {
  beforeEach(() => {
    questionAttachmentsRepository = new InMemoryQuestionAttachmentsRespository()
    questionsRepository = new InMemoryQuestionsRespository(
      questionAttachmentsRepository
    )
    answerAttachmentsRepository = new InMemoryAnswerAttachmentsRespository()
    answersRepository = new InMemoryAnswersRespository(
      answerAttachmentsRepository
    )
    sendNotificationUseCase = new SendNotificationUseCase(
      notificationsRepository
    )

    sendNotificationExecuteSpy = vi.spyOn(sendNotificationUseCase, 'execute')

    new OnQuestionBestAnswerChosen(answersRepository, sendNotificationUseCase)
  })

  it('should send a notification when queestion has new best answer chosen', async () => {
    const question = makeQuestion()
    const answer = makeAnswer({ questionId: question.id })

    await questionsRepository.create(question)
    await answersRepository.create(answer)

    question.bestAnswerId = answer.id

    await questionsRepository.save(question)

    await waitFor(() => expect(sendNotificationExecuteSpy).toHaveBeenCalled())
  })
})
