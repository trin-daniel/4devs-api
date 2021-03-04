import { Surveys } from '@Application/Entities'
import { LoadSurveyByIdRepository } from '@Data/Protocols/Database/Survey'
import { LoadSurveyByIdService } from '@Data/Services/Survey/Load-Survey-By-Id/Load-Survey-By-Id-service'
import Faker from 'faker'

interface SutTypes {
  Sut: LoadSurveyByIdService,
  LoadSurveyByIdRepositoryStub: LoadSurveyByIdRepository
}

const MockSurveys = (): Surveys => (
  {
    id: Faker.random.uuid(),
    question: Faker.lorem.paragraph(1),
    answers: [{
      image: Faker.image.imageUrl(),
      answer: Faker.random.word()
    }],
    date: new Date().toLocaleDateString('pt-br')
  }
)
const MOCK_SURVEYS_INSTANCE = MockSurveys()

const MockLoadSurveyByIdRepository = (): LoadSurveyByIdRepository => {
  class LoadSurveyByIdRepositoryStub implements LoadSurveyByIdRepository {
    async LoadById (id: string): Promise<Surveys> {
      return Promise.resolve(MOCK_SURVEYS_INSTANCE)
    }
  }
  return new LoadSurveyByIdRepositoryStub()
}

const MakeSut = (): SutTypes => {
  const LoadSurveyByIdRepositoryStub = MockLoadSurveyByIdRepository()
  const Sut = new LoadSurveyByIdService(LoadSurveyByIdRepositoryStub)
  return { Sut, LoadSurveyByIdRepositoryStub }
}

describe('Load Survey By Id Service', () => {
  describe('#LoadSurveyByIdRepository', () => {
    test('Should call LoadSurveyByIdRepository with correct id', async () => {
      const { Sut, LoadSurveyByIdRepositoryStub } = MakeSut()
      const LoadByIdSpy = jest.spyOn(LoadSurveyByIdRepositoryStub, 'LoadById')
      await Sut.Load(MOCK_SURVEYS_INSTANCE.id)
      expect(LoadByIdSpy).toHaveBeenCalledWith(MOCK_SURVEYS_INSTANCE.id)
    })

    test('Should return a survey when successful', async () => {
      const { Sut } = MakeSut()
      const Survey = await Sut.Load(MOCK_SURVEYS_INSTANCE.id)
      expect(Survey).toEqual(MOCK_SURVEYS_INSTANCE)
    })

    test('Should throw if LoadSurveyByIdRepository throws', async () => {
      const { Sut, LoadSurveyByIdRepositoryStub } = MakeSut()
      jest.spyOn(LoadSurveyByIdRepositoryStub, 'LoadById').mockRejectedValue(new Error())
      const PromiseRejected = Sut.Load(MOCK_SURVEYS_INSTANCE.id)
      await expect(PromiseRejected).rejects.toThrow()
    })
  })
})
