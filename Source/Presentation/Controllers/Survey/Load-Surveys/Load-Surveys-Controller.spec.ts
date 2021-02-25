import { Surveys } from '@Application/Entities'
import { LoadSurveysUseCase } from '@Application/Use-Cases/Survey/Load-Surveys-Use-Case'
import { Request } from '@Presentation/Protocols'
import { LoadSurveysController } from '@Presentation/Controllers/Survey/Load-Surveys/Load-Surveys-Controller'
import { NoContent, Ok, ServerErrorHelper } from '@Presentation/Helpers/Http-Helper'
import MockDate from 'mockdate'

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

const MockRequest = (): Request => ({
  body: {},
  headers: {},
  account_id: 'any_account_id'
})

const MockLoadSurveysUseCase = (): LoadSurveysUseCase => {
  class LoadSurveysUseCaseStub implements LoadSurveysUseCase {
    async Load (): Promise<Surveys[]> {
      return Promise.resolve(MockSurveys())
    }
  }
  return new LoadSurveysUseCaseStub()
}

type SutTypes = {Sut: LoadSurveysController, LoadSurveysUseCaseStub: LoadSurveysUseCase}

const makeSut = (): SutTypes => {
  const LoadSurveysUseCaseStub = MockLoadSurveysUseCase()
  const Sut = new LoadSurveysController(LoadSurveysUseCaseStub)
  return { Sut, LoadSurveysUseCaseStub }
}

describe('Load Surveys Controller', () => {
  beforeAll(() => MockDate.set(new Date()))
  afterAll(() => MockDate.reset())

  describe('#LoadSurveysUseCase', () => {
    test('Should call LoadSurveysUseCase with correct account_id', async () => {
      const { Sut, LoadSurveysUseCaseStub } = makeSut()
      const LoadSpy = jest.spyOn(LoadSurveysUseCaseStub, 'Load')
      await Sut.handle(MockRequest())
      expect(LoadSpy).toHaveBeenCalledWith(MockRequest().account_id)
    })

    test('Should return 200 on success', async () => {
      const { Sut } = makeSut()
      const Response = await Sut.handle(MockRequest())
      expect(Response).toEqual(Ok(MockSurveys()))
    })

    test('Should return 204 if LoadSurveysUseCase returns empty', async () => {
      const { Sut, LoadSurveysUseCaseStub } = makeSut()
      jest.spyOn(LoadSurveysUseCaseStub, 'Load').mockReturnValueOnce(Promise.resolve([]))
      const Response = await Sut.handle(MockRequest())
      expect(Response).toEqual(NoContent())
    })

    test('Should return 500 if LoadSurveysUseCase throws exception', async () => {
      const { Sut, LoadSurveysUseCaseStub } = makeSut()
      jest.spyOn(LoadSurveysUseCaseStub, 'Load').mockReturnValueOnce(Promise.reject(new Error()))
      const Response = await Sut.handle(MockRequest())
      expect(Response).toEqual(ServerErrorHelper(new Error()))
    })
  })
})
