import { LoadSurveysController } from './load-surveys-controller'
import { Surveys } from '../../../../domain/entities'
import { LoadSurveys } from '../../../../domain/use-cases/survey/load-surveys'
import { Request } from '../../../contracts'
import { set, reset } from 'mockdate'

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

const mockRequest = (): Request => ({
  body: {},
  headers: {}
})

const mockLoadSurveys = (): LoadSurveys => {
  class LoadSurveysStub implements LoadSurveys {
    async load (): Promise<Surveys[]> {
      return Promise.resolve(mockSurveys())
    }
  }
  return new LoadSurveysStub()
}

interface SutTypes {
  sut: LoadSurveysController,
  loadSurveysStub: LoadSurveys
}

const makeSut = (): SutTypes => {
  const loadSurveysStub = mockLoadSurveys()
  const sut = new LoadSurveysController(loadSurveysStub)
  return { sut, loadSurveysStub }
}

describe('Load Surveys Controller', () => {
  beforeAll(() => set(new Date()))
  afterAll(() => reset())

  describe('#LoadSurveys', () => {
    test('Should call LoadSurveys', async () => {
      const { sut, loadSurveysStub } = makeSut()
      const loadSpy = jest.spyOn(loadSurveysStub, 'load')
      const request = mockRequest()
      await sut.handle(request)
      expect(loadSpy).toHaveBeenCalled()
    })
  })
})
