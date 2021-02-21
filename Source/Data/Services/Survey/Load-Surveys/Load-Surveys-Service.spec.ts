import { Surveys } from '@Application/Entities'
import { LoadSurveysService } from '@Data/Services/Survey/Load-Surveys/Load-Surveys-Service'
import { LoadSurveysRepository } from '@Data/Protocols/Database'
import MockDate from 'mockdate'

type SutTypes = {Sut: LoadSurveysService, LoadSurveysRepositoryStub: LoadSurveysRepository}

const MockSurveys = (): Surveys[] => (
  [
    {
      id: '507f1f77bcf86cd799439011',
      question: 'any_question',
      answers: [{ image: 'any_image', answer: 'any_answer' }],
      date: new Date().toLocaleDateString('pt-br')
    },

    {
      id: '507f1f77bcf86cd799439011',
      question: 'another_question',
      answers: [{ image: 'another_image', answer: 'another_answer' }],
      date: new Date().toLocaleDateString('pt-br')
    }
  ]
)

const MockLoadSurveysRepository = (): LoadSurveysRepository => {
  class LoadSurveysRepositoryStub implements LoadSurveysRepository {
    async LoadAll (): Promise<Surveys[]> {
      return Promise.resolve(MockSurveys())
    }
  }
  return new LoadSurveysRepositoryStub()
}

const makeSut = (): SutTypes => {
  const LoadSurveysRepositoryStub = MockLoadSurveysRepository()
  const Sut = new LoadSurveysService(LoadSurveysRepositoryStub)
  return { Sut, LoadSurveysRepositoryStub }
}

describe('Load Surveys Service', () => {
  beforeAll(() => MockDate.set(new Date()))
  afterAll(() => MockDate.reset())

  describe('#LoadSurveysRepository', () => {
    test('Should call LoadSurveysRepository', async () => {
      const { Sut, LoadSurveysRepositoryStub } = makeSut()
      const LoadAllSpy = jest.spyOn(LoadSurveysRepositoryStub, 'LoadAll')
      await Sut.Load()
      expect(LoadAllSpy).toHaveBeenCalled()
    })

    test('Should return all surveys when the case is successful', async () => {
      const { Sut } = makeSut()
      const Surveys = await Sut.Load()
      expect(Surveys).toEqual(MockSurveys())
    })

    test('Should throw if LoadSurveysRepository throws', async () => {
      const { Sut, LoadSurveysRepositoryStub } = makeSut()
      jest.spyOn(LoadSurveysRepositoryStub, 'LoadAll').mockRejectedValueOnce(new Error())
      const PromiseRejected = Sut.Load()
      await expect(PromiseRejected).rejects.toThrow()
    })
  })
})
