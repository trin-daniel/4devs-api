import { SurveyResult, Surveys } from '@Application/Entities'
import { LoadSurveyByIdUseCase } from '@Application/Use-Cases/Survey/Load-Survey-By-Id-Use-Case'
import { Request } from '@Presentation/Protocols'
import { LoadSurveyResultController } from '@Presentation/Controllers/Survey-Result/Load-Survey-Result/Load-Survey-Result-Controller'
import { Forbidden, ServerErrorHelper } from '@Presentation/Helpers/Http-Helper'
import { InvalidParamError } from '@Presentation/Errors'
import { LoadSurveyResultUseCase } from '@Application/Use-Cases/Survey-Result/Load-Survey-Result-Use-Case'

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
    id: '507f1f77bcf86cd799439011',
    question: 'any_question',
    survey_id: 'any_survey_id',
    answers: [
      {
        image: 'any_image',
        answer: 'any_answer',
        count: 1,
        percent: 50
      }
    ],
    date: new Date().toLocaleDateString('pt-br')
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

const MockLoadSurveyResultUseCase = (): LoadSurveyResultUseCase => {
  class LoadSurveyResultUseCaseStub implements LoadSurveyResultUseCase {
    Load (survey_id: string): Promise<SurveyResult> {
      return Promise.resolve(MockSurveyResult())
    }
  }
  return new LoadSurveyResultUseCaseStub()
}

type SutTypes ={Sut: LoadSurveyResultController, LoadSurveyByIdUseCaseStub: LoadSurveyByIdUseCase, LoadSurveyResultUseCaseStub: LoadSurveyResultUseCase}

const makeSut = (): SutTypes => {
  const LoadSurveyResultUseCaseStub = MockLoadSurveyResultUseCase()
  const LoadSurveyByIdUseCaseStub = MockLoadSurveyByIdUseCase()
  const Sut = new LoadSurveyResultController(LoadSurveyByIdUseCaseStub, LoadSurveyResultUseCaseStub)
  return { Sut, LoadSurveyByIdUseCaseStub, LoadSurveyResultUseCaseStub }
}

describe('Load Survey Result Controller', () => {
  describe('#LoadSurveyByIdUseCase', () => {
    test('Should call LoadSurveyByIdUseCase with correct value', async () => {
      const { Sut, LoadSurveyByIdUseCaseStub } = makeSut()
      const LoadSpy = jest.spyOn(LoadSurveyByIdUseCaseStub, 'Load')
      const Request = MockRequest()
      const { params: { survey_id } } = Request
      await Sut.handle(Request)
      expect(LoadSpy).toHaveBeenCalledWith(survey_id)
    })

    test('Should return 403 if LoadSurveyByIdUseCase returns null', async () => {
      const { Sut, LoadSurveyByIdUseCaseStub } = makeSut()
      jest.spyOn(LoadSurveyByIdUseCaseStub, 'Load').mockResolvedValueOnce(null)
      const Response = await Sut.handle(MockRequest())
      expect(Response).toEqual(Forbidden(new InvalidParamError('survey_id')))
    })

    test('Should return 500 if LoadSurveyByIdUseCase throws exception', async () => {
      const { Sut, LoadSurveyByIdUseCaseStub } = makeSut()
      jest.spyOn(LoadSurveyByIdUseCaseStub, 'Load').mockRejectedValueOnce(new Error())
      const Response = await Sut.handle(MockRequest())
      expect(Response).toEqual(ServerErrorHelper(new Error()))
    })
  })

  describe('#LoadSurveyResultUseCase', () => {
    test('Should call LoadSurveyResultUseCase with correct value', async () => {
      const { Sut, LoadSurveyResultUseCaseStub } = makeSut()
      const LoadSpy = jest.spyOn(LoadSurveyResultUseCaseStub, 'Load')
      const Request = MockRequest()
      const { params: { survey_id } } = Request
      await Sut.handle(MockRequest())
      expect(LoadSpy).toHaveBeenCalledWith(survey_id)
    })

    test('Should return 500 if LoadSurveyResultUseCase throws exception', async () => {
      const { Sut, LoadSurveyResultUseCaseStub } = makeSut()
      jest.spyOn(LoadSurveyResultUseCaseStub, 'Load').mockRejectedValueOnce(new Error())
      const Response = await Sut.handle(MockRequest())
      expect(Response).toEqual(ServerErrorHelper(new Error()))
    })
  })
})
