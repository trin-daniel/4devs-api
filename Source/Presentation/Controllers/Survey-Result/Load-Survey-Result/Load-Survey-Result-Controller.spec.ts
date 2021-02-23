import { Surveys } from '@Application/Entities'
import { LoadSurveyByIdUseCase } from '@Application/Use-Cases/Survey/Load-Survey-By-Id-Use-Case'
import { Request } from '@Presentation/Protocols'
import { LoadSurveyResultController } from '@Presentation/Controllers/Survey-Result/Load-Survey-Result/Load-Survey-Result-Controller'

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

const MockLoadSurveyByIdUseCase = (): LoadSurveyByIdUseCase => {
  class LoadSurveyByIdUseCaseStub implements LoadSurveyByIdUseCase {
    async Load (id: string): Promise<Surveys> {
      return Promise.resolve(MockSurveys())
    }
  }
  return new LoadSurveyByIdUseCaseStub()
}

type SutTypes ={Sut: LoadSurveyResultController, LoadSurveyByIdUseCaseStub: LoadSurveyByIdUseCase}

const makeSut = (): SutTypes => {
  const LoadSurveyByIdUseCaseStub = MockLoadSurveyByIdUseCase()
  const Sut = new LoadSurveyResultController(LoadSurveyByIdUseCaseStub)
  return { Sut, LoadSurveyByIdUseCaseStub }
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
  })
})
