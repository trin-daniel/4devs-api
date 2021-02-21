import { Surveys } from '@Application/Entities'
import { LoadSurveyByIdRepository } from '@Data/Protocols/Database'
import { LoadSurveyByIdService } from '@Data/Services/Survey/Load-Survey-By-Id/Load-Survey-By-Id-service'
import MockDate from 'mockdate'

type SutTypes = {Sut: LoadSurveyByIdService, LoadSurveyByIdRepositoryStub: LoadSurveyByIdRepository}

const MockSurveys = (): Surveys => (

  {
    id: '507f1f77bcf86cd799439011',
    question: 'any_question',
    answers: [{ image: 'any_image', answer: 'any_answer' }],
    date: new Date().toLocaleDateString('pt-BR')
  }

)

const mockLoadSurveyByIdRepository = (): LoadSurveyByIdRepository => {
  class LoadSurveyByIdRepositoryStub implements LoadSurveyByIdRepository {
    async LoadById (id: string): Promise<Surveys> {
      return Promise.resolve(MockSurveys())
    }
  }
  return new LoadSurveyByIdRepositoryStub()
}

const makeSut = (): SutTypes => {
  const LoadSurveyByIdRepositoryStub = mockLoadSurveyByIdRepository()
  const Sut = new LoadSurveyByIdService(LoadSurveyByIdRepositoryStub)
  return { Sut, LoadSurveyByIdRepositoryStub }
}

describe('Load Survey By Id Service', () => {
  beforeAll(() => MockDate.set(new Date()))
  afterAll(() => MockDate.reset())

  describe('#LoadSurveyByIdRepository', () => {
    test('Should call LoadSurveyByIdRepository with correct id', async () => {
      const { Sut, LoadSurveyByIdRepositoryStub } = makeSut()
      const LoadByIdSpy = jest.spyOn(LoadSurveyByIdRepositoryStub, 'LoadById')
      await Sut.Load('any_id')
      expect(LoadByIdSpy).toHaveBeenCalledWith('any_id')
    })

    test('Should return a survey when successful', async () => {
      const { Sut } = makeSut()
      const Survey = await Sut.Load('any_id')
      expect(Survey).toEqual(MockSurveys())
    })

    test('Should throw if LoadSurveyByIdRepository throws', async () => {
      const { Sut, LoadSurveyByIdRepositoryStub } = makeSut()
      jest.spyOn(LoadSurveyByIdRepositoryStub, 'LoadById').mockRejectedValue(new Error())
      const PromiseRejected = Sut.Load('any_id')
      await expect(PromiseRejected).rejects.toThrow()
    })
  })
})
