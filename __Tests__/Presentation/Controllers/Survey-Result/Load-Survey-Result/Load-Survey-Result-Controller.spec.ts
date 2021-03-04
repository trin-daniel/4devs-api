import { SurveyResult } from '@Application/Entities'
import { LoadSurveyByIdUseCase } from '@Application/Use-Cases/Survey/Load-Survey-By-Id-Use-Case'
import { Request } from '@Presentation/Protocols'
import { LoadSurveyResultController } from '@Presentation/Controllers/Survey-Result/Load-Survey-Result/Load-Survey-Result-Controller'
import { Forbidden, Ok, ServerErrorHelper } from '@Presentation/Helpers/Http-Helper'
import { InvalidParamError } from '@Presentation/Errors'
import { LoadSurveyResultUseCase } from '@Application/Use-Cases/Survey-Result/Load-Survey-Result-Use-Case'
import { SurveysViewModel } from '@Presentation/View-Models'
import Faker from 'faker'

const MockRequest = (): Request =>
  (
    {
      body: { answer: Faker.random.word() },
      params: { survey_id: Faker.random.uuid() },
      account_id: Faker.random.uuid()
    }
  )
const MOCK_REQUEST_INSTANCE = MockRequest()

const MockSurveys = (): SurveysViewModel =>
  (
    {
      id: Faker.random.uuid(),
      question: Faker.lorem.paragraph(1),
      answers: [{
        image: Faker.image.imageUrl(),
        answer: MOCK_REQUEST_INSTANCE.body.answer
      }],
      date: new Date().toLocaleDateString('pt-br')
    }
  )
const MOCK_SURVEYS_INSTANCE = MockSurveys()

const MockSurveyResult = (): SurveyResult => (
  {
    id: Faker.random.uuid(),
    question: MOCK_SURVEYS_INSTANCE.question,
    survey_id: MOCK_SURVEYS_INSTANCE.id,
    answers: [
      {
        image: MOCK_SURVEYS_INSTANCE.answers[0].image,
        answer: MOCK_SURVEYS_INSTANCE.answers[0].answer,
        count: 1,
        percent: 50,
        isCurrentAccountAnswer: true
      }
    ],
    date: new Date().toLocaleDateString('pt-br')
  }
)
const MOCK_SURVEY_RESULT_INSTANCE = MockSurveyResult()

const MockLoadSurveyByIdUseCase = (): LoadSurveyByIdUseCase => {
  class LoadSurveyByIdUseCaseStub implements LoadSurveyByIdUseCase {
    async Load (id: string): Promise<SurveysViewModel> {
      return Promise.resolve(MOCK_SURVEYS_INSTANCE)
    }
  }
  return new LoadSurveyByIdUseCaseStub()
}

const MockLoadSurveyResultUseCase = (): LoadSurveyResultUseCase => {
  class LoadSurveyResultUseCaseStub implements LoadSurveyResultUseCase {
    Load (survey_id: string, account_id: string): Promise<SurveyResult> {
      return Promise.resolve(MOCK_SURVEY_RESULT_INSTANCE)
    }
  }
  return new LoadSurveyResultUseCaseStub()
}

interface SutTypes {
  Sut: LoadSurveyResultController,
  LoadSurveyByIdUseCaseStub: LoadSurveyByIdUseCase,
  LoadSurveyResultUseCaseStub: LoadSurveyResultUseCase
}

const MakeSut = (): SutTypes => {
  const LoadSurveyResultUseCaseStub = MockLoadSurveyResultUseCase()
  const LoadSurveyByIdUseCaseStub = MockLoadSurveyByIdUseCase()
  const Sut = new LoadSurveyResultController(
    LoadSurveyByIdUseCaseStub,
    LoadSurveyResultUseCaseStub)
  return {
    Sut,
    LoadSurveyByIdUseCaseStub,
    LoadSurveyResultUseCaseStub
  }
}

describe('Load Survey Result Controller', () => {
  describe('#LoadSurveyByIdUseCase', () => {
    test('Should call LoadSurveyByIdUseCase with correct value', async () => {
      const { Sut, LoadSurveyByIdUseCaseStub } = MakeSut()
      const LoadSpy = jest.spyOn(LoadSurveyByIdUseCaseStub, 'Load')
      const Request = MOCK_REQUEST_INSTANCE
      const { params: { survey_id } } = Request
      await Sut.handle(Request)
      expect(LoadSpy).toHaveBeenCalledWith(survey_id)
    })

    test('Should return 403 if LoadSurveyByIdUseCase returns null', async () => {
      const { Sut, LoadSurveyByIdUseCaseStub } = MakeSut()
      jest.spyOn(LoadSurveyByIdUseCaseStub, 'Load').mockResolvedValueOnce(null)
      const Response = await Sut.handle(MOCK_REQUEST_INSTANCE)
      expect(Response).toEqual(Forbidden(new InvalidParamError('survey_id')))
    })

    test('Should return 500 if LoadSurveyByIdUseCase throws exception', async () => {
      const { Sut, LoadSurveyByIdUseCaseStub } = MakeSut()
      jest.spyOn(LoadSurveyByIdUseCaseStub, 'Load').mockRejectedValueOnce(new Error())
      const Response = await Sut.handle(MockRequest())
      expect(Response).toEqual(ServerErrorHelper(new Error()))
    })
  })

  describe('#LoadSurveyResultUseCase', () => {
    test('Should call LoadSurveyResultUseCase with correct values', async () => {
      const { Sut, LoadSurveyResultUseCaseStub } = MakeSut()
      const LoadSpy = jest.spyOn(LoadSurveyResultUseCaseStub, 'Load')
      const Request = MOCK_REQUEST_INSTANCE
      const { params: { survey_id }, account_id } = Request
      await Sut.handle(MOCK_REQUEST_INSTANCE)
      expect(LoadSpy).toHaveBeenCalledWith(survey_id, account_id)
    })

    test('Should return 500 if LoadSurveyResultUseCase throws exception', async () => {
      const { Sut, LoadSurveyResultUseCaseStub } = MakeSut()
      jest.spyOn(LoadSurveyResultUseCaseStub, 'Load').mockRejectedValueOnce(new Error())
      const Response = await Sut.handle(MOCK_REQUEST_INSTANCE)
      expect(Response).toEqual(ServerErrorHelper(new Error()))
    })

    test('Should return 200 if all use cases are successful', async () => {
      const { Sut } = MakeSut()
      const Response = await Sut.handle(MOCK_REQUEST_INSTANCE)
      expect(Response).toEqual(Ok(MOCK_SURVEY_RESULT_INSTANCE))
    })
  })
})
