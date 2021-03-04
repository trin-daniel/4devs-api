import { LoadSurveyByIdUseCase } from '@Application/Use-Cases/Survey/Load-Survey-By-Id-Use-Case'
import { SurveyResultDTO } from '@Presentation/DTOS'
import { Request } from '@Presentation/Protocols'
import { SurveyResultViewModel, SurveysViewModel } from '@Presentation/View-Models'
import { SaveSurveyResultController } from '@Presentation/Controllers/Survey-Result/Save-Survey-Result/Save-Survey-Result-Controller'
import { InvalidParamError } from '@Presentation/Errors'
import { Forbidden, Ok, ServerErrorHelper } from '@Presentation/Helpers/Http-Helper'
import { SaveSurveyResultUseCase } from '@Application/Use-Cases/Survey-Result/Save-Survey-Result'
import Faker from 'faker'

interface SutTypes {
  Sut: SaveSurveyResultController,
  LoadSurveyByIdUseCaseStub: LoadSurveyByIdUseCase,
  SaveSurveyResultUseCaseStub: SaveSurveyResultUseCase
}

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

const MockSurveyResult = (): any => (
  {
    id: Faker.random.uuid(),
    account_id: MOCK_REQUEST_INSTANCE.account_id,
    survey_id: MOCK_REQUEST_INSTANCE.params.survey_id,
    answer: MOCK_REQUEST_INSTANCE.body.answer,
    date: MOCK_SURVEYS_INSTANCE.date
  }
)
const MOCK_SURVEY_RESULT_INSTANCE = MockSurveyResult()

const MockSurveyResultDTO = (): SurveyResultDTO =>
  (
    {
      account_id: MOCK_REQUEST_INSTANCE.account_id,
      survey_id: MOCK_REQUEST_INSTANCE.params.survey_id,
      answer: MOCK_SURVEYS_INSTANCE.answers[0].answer,
      date: MOCK_SURVEYS_INSTANCE.date
    }
  )
const MOCK_SURVEY_RESULT_DTO_INSTANCE = MockSurveyResultDTO()

const MockLoadSurveyByIdUseCase = (): LoadSurveyByIdUseCase => {
  class LoadSurveyByIdUseCaseStub implements LoadSurveyByIdUseCase {
    async Load (id: string): Promise<SurveysViewModel> {
      return Promise.resolve(MOCK_SURVEYS_INSTANCE)
    }
  }
  return new LoadSurveyByIdUseCaseStub()
}

const MockSaveSurveyResultUseCase = (): SaveSurveyResultUseCase => {
  class SaveSurveyResultUseCaseStub implements SaveSurveyResultUseCase {
    async Save (data: SurveyResultDTO): Promise<SurveyResultViewModel> {
      return Promise.resolve(MOCK_SURVEY_RESULT_INSTANCE)
    }
  }
  return new SaveSurveyResultUseCaseStub()
}

const MakeSut = (): SutTypes => {
  const SaveSurveyResultUseCaseStub = MockSaveSurveyResultUseCase()
  const LoadSurveyByIdUseCaseStub = MockLoadSurveyByIdUseCase()
  const Sut = new SaveSurveyResultController(
    LoadSurveyByIdUseCaseStub,
    SaveSurveyResultUseCaseStub
  )
  return {
    Sut,
    LoadSurveyByIdUseCaseStub,
    SaveSurveyResultUseCaseStub
  }
}

describe('Save Survey Result Controller', () => {
  describe('#LoadSurveyByIdUseCase', () => {
    test('Should call LoadSurveyByIdUseCase with correct value', async () => {
      const { Sut, LoadSurveyByIdUseCaseStub } = MakeSut()
      const LoadSpy = jest.spyOn(LoadSurveyByIdUseCaseStub, 'Load')
      await Sut.handle(MOCK_REQUEST_INSTANCE)
      expect(LoadSpy).toHaveBeenCalledWith(MOCK_REQUEST_INSTANCE.params.survey_id)
    })

    test('Should return 403 if LoadSurveyByIdUseCase returns null', async () => {
      const { Sut, LoadSurveyByIdUseCaseStub } = MakeSut()
      jest.spyOn(LoadSurveyByIdUseCaseStub, 'Load').mockResolvedValue(null)
      const Response = await Sut.handle(MOCK_REQUEST_INSTANCE)
      expect(Response).toEqual(Forbidden(new InvalidParamError('survey_id')))
    })

    test('Should return 500 if LoadSurveyByIdUseCase throws exception', async () => {
      const { Sut, LoadSurveyByIdUseCaseStub } = MakeSut()
      jest.spyOn(LoadSurveyByIdUseCaseStub, 'Load').mockRejectedValueOnce(new Error())
      const Response = await Sut.handle(MOCK_REQUEST_INSTANCE)
      expect(Response).toEqual(ServerErrorHelper(new Error()))
    })

    test('Should return 403 if an invalid answer is provided', async () => {
      const { Sut } = MakeSut()
      const Request = MockRequest()
      const WrongAnswer = Object.assign({}, Request, { body: { answer: 'wrong_answer' } })
      const Response = await Sut.handle(WrongAnswer)
      expect(Response).toEqual(Forbidden(new InvalidParamError('answer')))
    })
  })

  describe('#SaveSurveyResult', () => {
    test('Should call SaveSurveyResult with correct values', async () => {
      const { Sut, SaveSurveyResultUseCaseStub } = MakeSut()
      const SaveSpy = jest.spyOn(SaveSurveyResultUseCaseStub, 'Save')
      await Sut.handle(MOCK_REQUEST_INSTANCE)
      expect(SaveSpy).toHaveBeenCalledWith(MOCK_SURVEY_RESULT_DTO_INSTANCE)
    })

    test('Should return 200 if the SaveSurveyResult use case is successful', async () => {
      const { Sut } = MakeSut()
      const Response = await Sut.handle(MOCK_REQUEST_INSTANCE)
      expect(Response).toEqual(Ok(MOCK_SURVEY_RESULT_INSTANCE))
    })

    test('Should return 500 if SaveSurveyResult throws exception', async () => {
      const { Sut, SaveSurveyResultUseCaseStub } = MakeSut()
      jest.spyOn(SaveSurveyResultUseCaseStub, 'Save').mockRejectedValueOnce(new Error())
      const Response = await Sut.handle(MOCK_REQUEST_INSTANCE)
      expect(Response).toEqual(ServerErrorHelper(new Error()))
    })
  })
})
