import { SurveyResultDTO } from '@domain/dtos'
import { SurveyResult, Surveys } from '@domain/entities'
import { SaveSurveyResult } from '@domain/use-cases/survey-result/save-survey-result'
import { LoadSurveyById } from '@domain/use-cases/survey/load-survey-by-id'
import { Request } from '@presentation/contracts'
import { SaveSurveyResultController } from '@presentation/controllers/survey-result/save-survey-result/save-survey-result-controller'
import { InvalidParamError } from '@presentation/errors'
import { forbidden, ok, serverError } from '@presentation/helpers/http-helper'
import { reset, set } from 'mockdate'

type SutTypes = {
  sut: SaveSurveyResultController
  loadSurveyByIdStub: LoadSurveyById,
  saveSurveyResultStub: SaveSurveyResult
}

const mockRequest = (): Request =>
  (
    {
      body: { answer: 'any_answer' },
      headers: {},
      params: { survey_id: '507f1f77bcf86cd799439011' },
      account_id: 'd799439011f86f1011f77b12'
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

const mockSurveyResult = (): SurveyResult => (
  {
    id: 'bcf86cd50799437f1f779011',
    account_id: mockRequest().account_id,
    survey_id: mockSurveys().id,
    answer: mockRequest().body.answer,
    date: mockSurveys().date
  }
)

const mockSurveyResultDTO = (): SurveyResultDTO => (
  {
    account_id: mockRequest().account_id,
    survey_id: mockSurveys().id,
    answer: mockRequest().body.answer,
    date: mockSurveys().date
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

const mockSaveSurveyResult = (): SaveSurveyResult => {
  class SaveSurveyResultStub implements SaveSurveyResult {
    async save (data: SurveyResultDTO): Promise<SurveyResult> {
      return Promise.resolve(mockSurveyResult())
    }
  }
  return new SaveSurveyResultStub()
}

const makeSut = (): SutTypes => {
  const saveSurveyResultStub = mockSaveSurveyResult()
  const loadSurveyByIdStub = mockLoadSurveyById()
  const sut = new SaveSurveyResultController(loadSurveyByIdStub, saveSurveyResultStub)
  return { sut, loadSurveyByIdStub, saveSurveyResultStub }
}

describe('Save Survey Result Controller', () => {
  beforeAll(() => set(new Date()))
  afterAll(() => reset())

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

    test('Should return 500 if LoadSurveyById throws exception', async () => {
      const { sut, loadSurveyByIdStub } = makeSut()
      const request = mockRequest()
      jest.spyOn(loadSurveyByIdStub, 'load').mockRejectedValueOnce(new Error())
      const response = await sut.handle(request)
      expect(response).toEqual(serverError(new Error()))
    })

    test('Should return 403 if an invalid answer is provided', async () => {
      const { sut } = makeSut()
      const request = mockRequest()
      const wrongAnswer = Object.assign({}, request, { body: { answer: 'wrong_answer' } })
      const response = await sut.handle(wrongAnswer)
      expect(response).toEqual(forbidden(new InvalidParamError('answer')))
    })
  })

  describe('#SaveSurveyResult', () => {
    test('Should call SaveSurveyResult with correct values', async () => {
      const { sut, saveSurveyResultStub } = makeSut()
      const request = mockRequest()
      const saveSpy = jest.spyOn(saveSurveyResultStub, 'save')
      await sut.handle(request)
      expect(saveSpy).toHaveBeenCalledWith(mockSurveyResultDTO())
    })

    test('Should return 200 if the SaveSurveyResult use case is successful', async () => {
      const { sut } = makeSut()
      const request = mockRequest()
      const response = await sut.handle(request)
      expect(response).toEqual(ok(mockSurveyResult()))
    })

    test('Should return 500 if SaveSurveyResult throws exception', async () => {
      const { sut, saveSurveyResultStub } = makeSut()
      const request = mockRequest()
      jest.spyOn(saveSurveyResultStub, 'save').mockRejectedValueOnce(new Error())
      const response = await sut.handle(request)
      expect(response).toEqual(serverError(new Error()))
    })
  })
})
