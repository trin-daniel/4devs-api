import { SurveyResultDTO } from '@Application/DTOS'
import { SurveyResult, Surveys } from '@Application/Entities'
import { Request } from '@Presentation/Protocols'
import { SaveSurveyResultController } from '@Presentation/Controllers/Survey-Result/Save-Survey-Result/Save-Survey-Result-Controller'
import { InvalidParamError } from '@Presentation/Errors'
import { Forbidden, Ok, ServerErrorHelper } from '@Presentation/Helpers/Http-Helper'
import { LoadSurveyByIdUseCase } from '@Application/Use-Cases/Survey/Load-Survey-By-Id-Use-Case'
import { SaveSurveyResultUseCase } from '@Application/Use-Cases/Survey-Result/Save-Survey-Result'
import { reset, set } from 'mockdate'

type SutTypes = {Sut: SaveSurveyResultController, LoadSurveyByIdUseCaseStub: LoadSurveyByIdUseCase, SaveSurveyResultUseCaseStub: SaveSurveyResultUseCase}

const MockRequest = (): Request =>
  (
    {
      body: { answer: 'any_answer' },
      headers: {},
      params: { survey_id: '507f1f77bcf86cd799439011' },
      account_id: 'd799439011f86f1011f77b12'
    }
  )

const MockSurveys = (): Surveys =>
  (
    {
      id: '507f1f77bcf86cd799439011',
      question: 'any_question',
      answers: [{ image: 'any_image', answer: 'any_answer' }],
      date: new Date().toLocaleDateString('pt-br')
    }
  )

const MockSurveyResult = (): SurveyResult => (
  {
    id: 'bcf86cd50799437f1f779011',
    account_id: MockRequest().account_id,
    survey_id: MockSurveys().id,
    answer: MockRequest().body.answer,
    date: MockSurveys().date
  }
)

const MockSurveyResultDTO = (): SurveyResultDTO =>
  (
    {
      account_id: MockRequest().account_id,
      survey_id: MockSurveys().id,
      answer: MockRequest().body.answer,
      date: MockSurveys().date
    }
  )

const MockLoadSurveyByIdUseCase = (): LoadSurveyByIdUseCase => {
  class LoadSurveyByIdUseCaseStub implements LoadSurveyByIdUseCase {
    async Load (id: string): Promise<Surveys> {
      return Promise.resolve(MockSurveys())
    }
  }
  return new LoadSurveyByIdUseCaseStub()
}

const MockSaveSurveyResultUseCase = (): SaveSurveyResultUseCase => {
  class SaveSurveyResultUseCaseStub implements SaveSurveyResultUseCase {
    async Save (data: SurveyResultDTO): Promise<SurveyResult> {
      return Promise.resolve(MockSurveyResult())
    }
  }
  return new SaveSurveyResultUseCaseStub()
}

const makeSut = (): SutTypes => {
  const SaveSurveyResultUseCaseStub = MockSaveSurveyResultUseCase()
  const LoadSurveyByIdUseCaseStub = MockLoadSurveyByIdUseCase()
  const Sut = new SaveSurveyResultController(LoadSurveyByIdUseCaseStub, SaveSurveyResultUseCaseStub)
  return { Sut, LoadSurveyByIdUseCaseStub, SaveSurveyResultUseCaseStub }
}

describe('Save Survey Result Controller', () => {
  beforeAll(() => set(new Date()))
  afterAll(() => reset())

  describe('#LoadSurveyByIdUseCase', () => {
    test('Should call LoadSurveyByIdUseCase with correct value', async () => {
      const { Sut, LoadSurveyByIdUseCaseStub } = makeSut()
      const { params, body, headers } = MockRequest()
      const LoadSpy = jest.spyOn(LoadSurveyByIdUseCaseStub, 'Load')
      await Sut.handle({ params, body, headers })
      expect(LoadSpy).toHaveBeenCalledWith(params.survey_id)
    })

    test('Should return 403 if LoadSurveyByIdUseCase returns null', async () => {
      const { Sut, LoadSurveyByIdUseCaseStub } = makeSut()
      jest.spyOn(LoadSurveyByIdUseCaseStub, 'Load').mockResolvedValue(null)
      const Response = await Sut.handle(MockRequest())
      expect(Response).toEqual(Forbidden(new InvalidParamError('survey_id')))
    })

    test('Should return 500 if LoadSurveyByIdUseCase throws exception', async () => {
      const { Sut, LoadSurveyByIdUseCaseStub } = makeSut()
      jest.spyOn(LoadSurveyByIdUseCaseStub, 'Load').mockRejectedValueOnce(new Error())
      const Response = await Sut.handle(MockRequest())
      expect(Response).toEqual(ServerErrorHelper(new Error()))
    })

    test('Should return 403 if an invalid answer is provided', async () => {
      const { Sut } = makeSut()
      const Request = MockRequest()
      const WrongAnswer = Object.assign({}, Request, { body: { answer: 'wrong_answer' } })
      const Response = await Sut.handle(WrongAnswer)
      expect(Response).toEqual(Forbidden(new InvalidParamError('answer')))
    })
  })

  describe('#SaveSurveyResult', () => {
    test('Should call SaveSurveyResult with correct values', async () => {
      const { Sut, SaveSurveyResultUseCaseStub } = makeSut()
      const SaveSpy = jest.spyOn(SaveSurveyResultUseCaseStub, 'Save')
      await Sut.handle(MockRequest())
      expect(SaveSpy).toHaveBeenCalledWith(MockSurveyResultDTO())
    })

    test('Should return 200 if the SaveSurveyResult use case is successful', async () => {
      const { Sut } = makeSut()
      const Response = await Sut.handle(MockRequest())
      expect(Response).toEqual(Ok(MockSurveyResult()))
    })

    test('Should return 500 if SaveSurveyResult throws exception', async () => {
      const { Sut, SaveSurveyResultUseCaseStub } = makeSut()
      jest.spyOn(SaveSurveyResultUseCaseStub, 'Save').mockRejectedValueOnce(new Error())
      const Response = await Sut.handle(MockRequest())
      expect(Response).toEqual(ServerErrorHelper(new Error()))
    })
  })
})
