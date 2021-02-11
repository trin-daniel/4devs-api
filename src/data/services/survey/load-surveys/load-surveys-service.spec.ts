import { LoadSurveysService } from './load-surveys-service'
import { LoadSurveysRepository } from '../../../contracts'
import { Surveys } from '../../../../domain/entities'

interface SutTypes {
  sut: LoadSurveysService,
  loadSurveysRepositoryStub: LoadSurveysRepository
}

const mockSurveys = (): Surveys[] => (
  [
    {
      id: '507f1f77bcf86cd799439011',
      question: 'any_question',
      answers: [{ image: 'any_image', answer: 'any_answer' }],
      date: new Date()
    },

    {
      id: '507f1f77bcf86cd799439011',
      question: 'another_question',
      answers: [{ image: 'another_image', answer: 'another_answer' }],
      date: new Date()
    }
  ]
)

const mockLoadSurveysRepository = (): LoadSurveysRepository => {
  class LoadSurveysRepositoryStub implements LoadSurveysRepository {
    async loadAll (): Promise<Surveys[]> {
      return Promise.resolve(mockSurveys())
    }
  }
  return new LoadSurveysRepositoryStub()
}

const makeSut = (): SutTypes => {
  const loadSurveysRepositoryStub = mockLoadSurveysRepository()
  const sut = new LoadSurveysService(loadSurveysRepositoryStub)
  return { sut, loadSurveysRepositoryStub }
}

describe('Load Surveys Service', () => {
  describe('#LoadSurveysRepository', () => {
    test('Should call LoadSurveysRepository', async () => {
      const { sut, loadSurveysRepositoryStub } = makeSut()
      const loadAllSpy = jest.spyOn(loadSurveysRepositoryStub, 'loadAll')
      await sut.load()
      expect(loadAllSpy).toHaveBeenCalled()
    })
  })
})
