import { AppModule } from '@/app.module'
import { PrismaService } from '@/prisma/prisma.service'
import { INestApplication } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { Test } from '@nestjs/testing'
import req from 'supertest'

describe('Fetch Recent Question (E2E)', () => {
  let app: INestApplication
  let prisma: PrismaService
  let jwt: JwtService

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule],
    }).compile()

    app = moduleRef.createNestApplication()
    prisma = moduleRef.get(PrismaService)
    jwt = moduleRef.get(JwtService)

    await app.init()
  })

  test('[GET] /questions', async () => {
    const { id } = await prisma.user.create({
      data: {
        name: 'John Doe',
        email: 'johndoe@example.com',
        password: 'johndoe1234',
      },
    })

    const accessToken = jwt.sign({ sub: id })

    await prisma.question.createMany({
      data: [
        {
          title: 'Question 01',
          content: 'Question content',
          slug: 'question-01',
          authorId: id,
        },
        {
          title: 'Question 02',
          content: 'Question content',
          slug: 'question-02',
          authorId: id,
        },
      ],
    })

    const response = await req(app.getHttpServer())
      .set('Authorization', `Bearer ${accessToken}`)
      .get('/questions')
      .send()

    expect(response.statusCode).toBe(200)
    expect(response.body).toEqual({
      questions: [
        expect.objectContaining({ title: 'Question 01' }),
        expect.objectContaining({ title: 'Question 02' }),
      ],
    })
  })
})
