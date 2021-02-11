import { LoadSurveysController } from './load-surveys-controller'
import { Surveys } from '../../../../domain/entities'
import { LoadSurveys } from '../../../../domain/use-cases/survey/load-surveys'
import { Request } from '../../../contracts'
import { noContent, ok, serverError } from '../../../helpers/http-helper'
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

    test('Should return 200 on success', async () => {
      const { sut } = makeSut()
      const request = mockRequest()
      const response = await sut.handle(request)
      expect(response).toEqual(ok(mockSurveys()))
    })

    test('Should return 204 if LoadSurveys returns empty', async () => {
      const { sut, loadSurveysStub } = makeSut()
      jest.spyOn(loadSurveysStub, 'load').mockReturnValueOnce(Promise.resolve([]))
      const request = mockRequest()
      const response = await sut.handle(request)
      expect(response).toEqual(noContent())
    })

    test('Should return 500 if LoadSurveys throws exception', async () => {
      const { sut, loadSurveysStub } = makeSut()
      jest.spyOn(loadSurveysStub, 'load').mockReturnValueOnce(Promise.reject(new Error()))
      const request = mockRequest()
      const response = await sut.handle(request)
      expect(response).toEqual(serverError(new Error()))
    })
  })
})
