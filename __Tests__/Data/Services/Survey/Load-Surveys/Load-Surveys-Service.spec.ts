import { Account, Surveys } from '@Application/Entities'
import { LoadSurveysService } from '@Data/Services/Survey/Load-Surveys/Load-Surveys-Service'
import { LoadSurveysRepository } from '@Data/Protocols/Database/Survey'
import Faker from 'faker'

interface SutTypes {
  Sut: LoadSurveysService,
  LoadSurveysRepositoryStub: LoadSurveysRepository
}
const MockAccount = (): Account =>
  (
    {
      id: Faker.random.uuid(),
      name: Faker.internet.userName(),
      email: Faker.internet.email(),
      password: Faker.internet.password()
    }
  )
const MOCK_ACCOUNT_INSTANCE = MockAccount()

const MockSurveys = (): Surveys[] => (
  [
    {
      id: Faker.random.uuid(),
      question: Faker.lorem.paragraph(1),
      answers: [{
        image: Faker.image.imageUrl(),
        answer: Faker.random.word()
      }],
      date: new Date().toLocaleDateString('pt-br')
    },
    {
      id: Faker.random.uuid(),
      question: Faker.lorem.paragraph(1),
      answers: [{
        image: Faker.image.imageUrl(),
        answer: Faker.random.word()
      }],
      date: new Date().toLocaleDateString('pt-br')
    }
  ]
)
const MOCK_SURVEYS_INSTANCE = MockSurveys()

const MockLoadSurveysRepository = (): LoadSurveysRepository => {
  class LoadSurveysRepositoryStub implements LoadSurveysRepository {
    async LoadAll (): Promise<Surveys[]> {
      return Promise.resolve(MOCK_SURVEYS_INSTANCE)
    }
  }
  return new LoadSurveysRepositoryStub()
}

const MakeSut = (): SutTypes => {
  const LoadSurveysRepositoryStub = MockLoadSurveysRepository()
  const Sut = new LoadSurveysService(LoadSurveysRepositoryStub)
  return { Sut, LoadSurveysRepositoryStub }
}

describe('Load Surveys Service', () => {
  describe('#LoadSurveysRepository', () => {
    test('Should call LoadSurveysRepository with correct account_id', async () => {
      const { Sut, LoadSurveysRepositoryStub } = MakeSut()
      const LoadAllSpy = jest.spyOn(LoadSurveysRepositoryStub, 'LoadAll')
      await Sut.Load(MOCK_ACCOUNT_INSTANCE.id)
      expect(LoadAllSpy).toHaveBeenCalledWith(MOCK_ACCOUNT_INSTANCE.id)
    })

    test('Should return all surveys when the case is successful', async () => {
      const { Sut } = MakeSut()
      const Surveys = await Sut.Load(MOCK_ACCOUNT_INSTANCE.id)
      expect(Surveys).toEqual(MOCK_SURVEYS_INSTANCE)
    })

    test('Should throw if LoadSurveysRepository throws', async () => {
      const { Sut, LoadSurveysRepositoryStub } = MakeSut()
      jest.spyOn(LoadSurveysRepositoryStub, 'LoadAll').mockRejectedValueOnce(new Error())
      const PromiseRejected = Sut.Load(MOCK_ACCOUNT_INSTANCE.id)
      await expect(PromiseRejected).rejects.toThrow()
    })
  })
})
