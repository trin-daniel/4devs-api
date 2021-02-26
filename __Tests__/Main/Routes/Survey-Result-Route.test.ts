import { AccountDTO, SurveyDTO } from '@Application/DTOS'
import { Account, Surveys } from '@Application/Entities'
import { MongoHelper } from '@Infra/Database/Mongo/Helper/Mongo-Helper'
import App from '@Main/Config/App'
import Env from '@Main/Config/Env'
import JsonWebToken from 'jsonwebtoken'
import Supertest from 'supertest'
import Bcrypt from 'bcrypt'

const MockAccountDTO = async (): Promise<AccountDTO> =>
  (
    {
      name: 'any_name',
      email: 'any_email@gmail.com',
      password: await Bcrypt.hash('any_password', 12)
    }
  )

const InsertAccount = async () => {
  const collection = await MongoHelper.collection('accounts')
  const { ops } = await collection.insertOne(await MockAccountDTO())
  const [res] = ops
  const FormattedAccount = await MongoHelper.mapper(res) as Account

  return FormattedAccount
}

const UpdateTokenAccount = async () => {
  const Account = await InsertAccount()
  const Collection = await MongoHelper.collection('accounts')
  await Collection.updateOne(
    { _id: Account.id },
    { $set: { token: JsonWebToken.sign({ id: 'any_id' }, Env.SECRET_KEY) } }
  )
  return MongoHelper.mapper(await Collection.findOne({ _id: Account.id }))
}

const MockSurveyDTO = (): SurveyDTO => ({
  question: 'any_question',
  answers:
    [
      {
        image: 'any_images',
        answer: 'any_answer'
      }
    ],
  date: new Date().toLocaleDateString('pt-br')
})

const InsertSurvey = async () => {
  const Collection = await MongoHelper.collection('surveys')
  const { ops } = await Collection.insertOne(MockSurveyDTO())
  const [res] = ops
  return MongoHelper.mapper(res) as Surveys
}

describe('Survey Result Route', () => {
  beforeAll(async () => await MongoHelper.connect(process.env.MONGO_URL))
  afterAll(async () => await MongoHelper.disconnect())
  beforeEach(async () => {
    const Collection = await MongoHelper.collection('accounts')
    await Collection.deleteMany({})
    const SurveysCollection = await MongoHelper.collection('surveys')
    await SurveysCollection.deleteMany({})
  })

  describe('#PUT/Surveys', () => {
    test('Should return 403 if no token is provided', async () => {
      await Supertest(App)
        .put('/api/surveys/any_id/results')
        .send({ answer: 'any_answer' })
        .expect(403)
    })

    test('Should return 200 if token is provided', async () => {
      const Survey = await InsertSurvey()
      const Account = await UpdateTokenAccount()
      await Supertest(App)
        .put(`/api/surveys/${Survey.id}/results`)
        .set('x-access-token', Account.token)
        .send({ answer: 'any_answer' })
        .expect(200)
    })
  })
})
