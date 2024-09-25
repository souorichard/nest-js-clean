import { DomainEvents } from '@/core/events/domain-events'
import { EventHandler } from '@/core/events/event-handler'
import { AnswersRepository } from '@/domain/forum/application/repositories/answers-repository'
import { QuestionBestQuestionChosenEvent } from '@/domain/forum/enterprise/events/question-best-answer-chosen-event'

import { SendNotificationUseCase } from '../use-cases/send-notification'

export class OnQuestionBestAnswerChosen implements EventHandler {
  constructor(
    private answersRepository: AnswersRepository,
    private sendNotification: SendNotificationUseCase,
  ) {
    this.setupSubscriptions()
  }

  setupSubscriptions() {
    DomainEvents.register(
      this.sendQuestionBestAnswerNotiication.bind(this),
      QuestionBestQuestionChosenEvent.name,
    )
  }

  private async sendQuestionBestAnswerNotiication({
    question,
    bestAnswerId,
  }: QuestionBestQuestionChosenEvent) {
    const answer = await this.answersRepository.findById(
      bestAnswerId.toString(),
    )

    if (answer) {
      await this.sendNotification.execute({
        recipientId: question.authorId.toString(),
        title: 'Sua resposta foi escolhida!',
        content: `A resposta aque você enviou em "${question.title.substring(0, 20).concat('...')}" foi escolhida pelo autor!`,
      })
    }
  }
}
