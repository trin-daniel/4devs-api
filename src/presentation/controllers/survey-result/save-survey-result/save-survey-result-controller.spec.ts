import { Surveys } from '@domain/entities'
import { LoadSurveyById } from '@domain/use-cases/survey/load-survey-by-id'
import { Request } from '@presentation/contracts'
import { SaveSurveyResultController } from '@presentation/controllers/survey-result/save-survey-result/save-survey-result-controller'
import { InvalidParamError } from '@presentation/errors'
import { forbidden } from '@presentation/helpers/http-helper'

type SutTypes = {
  sut: SaveSurveyResultController
  loadSurveyByIdStub: LoadSurveyById
}

const mockRequest = (): Request =>
  (
    {
      body: {},
      headers: {},
      params: { survey_id: '507f1f77bcf86cd799439011' }
    }
  )

const mockSurveys = (): Surveys =>
  (
    {
      id: '507f1f77bcf86cd799439011',
      question: 'any_question',
      answers: [{ image: 'any_image', answer: 'any_answer' }],
      date: new Date()
    }
  )

const mockLoadSurveyById = (): LoadSurveyById => {
  class LoadSurveyByIdStub implements LoadSurveyById {
    async load (id: string): Promise<Surveys> {
      return Promise.resolve(mockSurveys())
    }
  }
  return new LoadSurveyByIdStub()
}

const makeSut = (): SutTypes => {
  const loadSurveyByIdStub = mockLoadSurveyById()
  const sut = new SaveSurveyResultController(loadSurveyByIdStub)
  return { sut, loadSurveyByIdStub }
}

describe('Save Survey Result Controller', () => {
  describe('#LoadSurveyById', () => {
    test('Should call LoadSurveyById with correct value', async () => {
      const { sut, loadSurveyByIdStub } = makeSut()
      const request = mockRequest()
      const loadSpy = jest.spyOn(loadSurveyByIdStub, 'load')
      await sut.handle(request)
      expect(loadSpy).toHaveBeenCalledWith(request.params.survey_id)
    })

    test('Should return 403 if LoadSurveyById returns null', async () => {
      const { sut, loadSurveyByIdStub } = makeSut()
      const request = mockRequest()
      jest.spyOn(loadSurveyByIdStub, 'load').mockResolvedValue(null)
      const response = await sut.handle(request)
      expect(response).toEqual(forbidden(new InvalidParamError('survey_id')))
    })
  })
})
