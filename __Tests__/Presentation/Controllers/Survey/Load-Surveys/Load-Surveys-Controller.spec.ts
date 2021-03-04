import { LoadSurveysUseCase } from '@Application/Use-Cases/Survey/Load-Surveys-Use-Case'
import { Request } from '@Presentation/Protocols'
import { SurveysViewModel } from '@Presentation/View-Models'
import { LoadSurveysController } from '@Presentation/Controllers/Survey/Load-Surveys/Load-Surveys-Controller'
import { NoContent, Ok, ServerErrorHelper } from '@Presentation/Helpers/Http-Helper'
import Faker from 'faker'

interface SutTypes {
  Sut: LoadSurveysController,
  LoadSurveysUseCaseStub: LoadSurveysUseCase
}

const MockSurveys = (): SurveysViewModel[] => (
  [
    {
      id: Faker.random.uuid(),
      question: Faker.lorem.paragraph(1),
      answers: [{
        image: Faker.image.imageUrl(),
        answer: Faker.random.word()
      }],
      date: new Date().toLocaleDateString('pt-br')
    },
    {
      id: Faker.random.uuid(),
      question: Faker.lorem.paragraph(1),
      answers: [{
        image: Faker.image.imageUrl(),
        answer: Faker.random.word()
      }],
      date: new Date().toLocaleDateString('pt-br')
    }
  ]
)

const MockRequest = (): Request => (
  {
    body: {},
    headers: {},
    account_id: Faker.random.uuid()
  }
)

const MockLoadSurveysUseCase = (): LoadSurveysUseCase => {
  class LoadSurveysUseCaseStub implements LoadSurveysUseCase {
    async Load (): Promise<SurveysViewModel[]> {
      return Promise.resolve(MOCK_SURVEYS_INSTANCE)
    }
  }
  return new LoadSurveysUseCaseStub()
}
const MOCK_SURVEYS_INSTANCE = MockSurveys()
const MOCK_REQUEST_INSTANCE = MockRequest()

const MakeSut = (): SutTypes => {
  const LoadSurveysUseCaseStub = MockLoadSurveysUseCase()
  const Sut = new LoadSurveysController(LoadSurveysUseCaseStub)
  return { Sut, LoadSurveysUseCaseStub }
}

describe('Load Surveys Controller', () => {
  describe('#LoadSurveysUseCase', () => {
    test('Should call LoadSurveysUseCase with correct account_id', async () => {
      const { Sut, LoadSurveysUseCaseStub } = MakeSut()
      const LoadSpy = jest.spyOn(LoadSurveysUseCaseStub, 'Load')
      await Sut.handle(MOCK_REQUEST_INSTANCE)
      expect(LoadSpy).toHaveBeenCalledWith(MOCK_REQUEST_INSTANCE.account_id)
    })

    test('Should return 200 on success', async () => {
      const { Sut } = MakeSut()
      const Response = await Sut.handle(MOCK_REQUEST_INSTANCE)
      expect(Response).toEqual(Ok(MOCK_SURVEYS_INSTANCE))
    })

    test('Should return 204 if LoadSurveysUseCase returns empty', async () => {
      const { Sut, LoadSurveysUseCaseStub } = MakeSut()
      jest.spyOn(LoadSurveysUseCaseStub, 'Load').mockReturnValueOnce(Promise.resolve([]))
      const Response = await Sut.handle(MOCK_REQUEST_INSTANCE)
      expect(Response).toEqual(NoContent())
    })

    test('Should return 500 if LoadSurveysUseCase throws exception', async () => {
      const { Sut, LoadSurveysUseCaseStub } = MakeSut()
      jest.spyOn(LoadSurveysUseCaseStub, 'Load').mockReturnValueOnce(Promise.reject(new Error()))
      const Response = await Sut.handle(MOCK_REQUEST_INSTANCE)
      expect(Response).toEqual(ServerErrorHelper(new Error()))
    })
  })
})
