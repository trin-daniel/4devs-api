import { Account, SurveyResult, Surveys } from '@Application/Entities'
import { LoadSurveyByIdRepository, LoadSurveyResultRepository } from '@Data/Protocols/Database/Survey'
import { LoadSurveyResultService } from '@Data/Services/Survey-Result/Load-Survey-Result/Load-Survey-Result-Service'
import Faker from 'faker'

interface SutTypes {
  Sut: LoadSurveyResultService,
  LoadSurveyResultRepositoryStub: LoadSurveyResultRepository,
  LoadSurveyByIdRepositoryStub: LoadSurveyByIdRepository
}
const EXPECTED_HASH = Faker.random.uuid()
const MockAccount = (): Account =>
  (
    {
      id: Faker.random.uuid(),
      name: Faker.internet.userName(),
      email: Faker.internet.email(),
      password: EXPECTED_HASH
    }
  )
const MOCK_ACCOUNT_INSTANCE = MockAccount()

const MockSurveys = (): Surveys => (
  {
    id: Faker.random.uuid(),
    question: Faker.lorem.paragraph(1),
    answers: [{
      image: Faker.image.imageUrl(),
      answer: Faker.random.word()
    }],
    date: new Date().toLocaleDateString('pt-BR')
  }
)

const MOCK_SURVEYS_INSTANCE = MockSurveys()

const MockSurveyResult = (): SurveyResult => (
  {
    id: MOCK_SURVEYS_INSTANCE.id,
    question: MOCK_SURVEYS_INSTANCE.question,
    survey_id: MOCK_SURVEYS_INSTANCE.id,
    answers: [{
      image: MOCK_SURVEYS_INSTANCE.answers[0].image,
      answer: MOCK_SURVEYS_INSTANCE.answers[0].answer,
      count: 0,
      percent: 0,
      isCurrentAccountAnswer: false
    }],
    date: new Date().toLocaleDateString('pt-br')
  }
)

const MOCK_SURVEY_RESULT_INSTANCE = MockSurveyResult()

const MockLoadSurveyResultRepository = (): LoadSurveyResultRepository => {
  class LoadSurveyResultRepositoryStub implements LoadSurveyResultRepository {
    async LoadBySurveyId (survey_id: string, account_id: string): Promise<SurveyResult> {
      return Promise.resolve(MOCK_SURVEY_RESULT_INSTANCE)
    }
  }
  return new LoadSurveyResultRepositoryStub()
}

const MockLoadSurveyByIdRepository = (): LoadSurveyByIdRepository => {
  class LoadSurveyByIdRepositoryStub implements LoadSurveyByIdRepository {
    async LoadById (id: string): Promise<Surveys> {
      return Promise.resolve(MOCK_SURVEYS_INSTANCE)
    }
  }
  return new LoadSurveyByIdRepositoryStub()
}

const MakeSut = (): SutTypes => {
  const LoadSurveyByIdRepositoryStub = MockLoadSurveyByIdRepository()
  const LoadSurveyResultRepositoryStub = MockLoadSurveyResultRepository()
  const Sut = new LoadSurveyResultService(
    LoadSurveyResultRepositoryStub,
    LoadSurveyByIdRepositoryStub
  )
  return {
    Sut,
    LoadSurveyResultRepositoryStub,
    LoadSurveyByIdRepositoryStub
  }
}

describe('Load Survey Result UseCase', () => {
  describe('#LoadSurveyResultRepository', () => {
    test('Should call LoadSurveyResultRepository with correct values', async () => {
      const { Sut, LoadSurveyResultRepositoryStub } = MakeSut()
      const LoadBySurveyIdSpy = jest.spyOn(LoadSurveyResultRepositoryStub, 'LoadBySurveyId')
      await Sut.Load(MOCK_SURVEY_RESULT_INSTANCE.survey_id, MOCK_ACCOUNT_INSTANCE.id)
      expect(LoadBySurveyIdSpy).toHaveBeenCalledWith(MOCK_SURVEY_RESULT_INSTANCE.survey_id, MOCK_ACCOUNT_INSTANCE.id)
    })

    test('Should return a SurveyResult if LoadSurveyResultRepository succeeds', async () => {
      const { Sut } = MakeSut()
      const SurveyResult = await Sut.Load(MOCK_SURVEY_RESULT_INSTANCE.survey_id, MOCK_ACCOUNT_INSTANCE.id)
      expect(SurveyResult).toEqual(MOCK_SURVEY_RESULT_INSTANCE)
    })

    test('Should throw if LoadSurveyResultRepository throws', async () => {
      const { Sut, LoadSurveyResultRepositoryStub } = MakeSut()
      jest.spyOn(LoadSurveyResultRepositoryStub, 'LoadBySurveyId').mockRejectedValueOnce(new Error())
      const PromiseRejected = Sut.Load(MOCK_SURVEY_RESULT_INSTANCE.survey_id, MOCK_ACCOUNT_INSTANCE.id)
      await expect(PromiseRejected).rejects.toThrow()
    })

    test('Should call LoadSurveyByIdRepository if LoadSurveyResultRepository returns null', async () => {
      const {
        Sut,
        LoadSurveyResultRepositoryStub,
        LoadSurveyByIdRepositoryStub
      } = MakeSut()
      jest.spyOn(LoadSurveyResultRepositoryStub, 'LoadBySurveyId').mockResolvedValueOnce(null)
      const LoadByIdSpy = jest.spyOn(LoadSurveyByIdRepositoryStub, 'LoadById')
      await Sut.Load(MOCK_SURVEY_RESULT_INSTANCE.survey_id, MOCK_ACCOUNT_INSTANCE.id)
      expect(LoadByIdSpy).toHaveBeenCalledWith(MOCK_SURVEY_RESULT_INSTANCE.survey_id)
    })

    test('Should return SurveyResult with all answers with count and percent zeroed', async () => {
      const { Sut, LoadSurveyResultRepositoryStub } = MakeSut()
      jest.spyOn(LoadSurveyResultRepositoryStub, 'LoadBySurveyId').mockResolvedValueOnce(null)
      const SurveyResult = await Sut.Load(MOCK_SURVEYS_INSTANCE.id, MOCK_ACCOUNT_INSTANCE.id)
      expect(SurveyResult).toEqual(MOCK_SURVEY_RESULT_INSTANCE)
    })
  })
})
