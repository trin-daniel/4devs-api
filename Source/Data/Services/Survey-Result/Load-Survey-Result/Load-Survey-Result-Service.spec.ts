import { SurveyResult, Surveys } from '@Application/Entities'
import { LoadSurveyByIdRepository, LoadSurveyResultRepository } from '@Data/Protocols/Database'
import { LoadSurveyResultService } from '@Data/Services/Survey-Result/Load-Survey-Result/Load-Survey-Result-Service'

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

const MockSurveys = (): Surveys => (

  {
    id: '507f1f77bcf86cd799439011',
    question: 'any_question',
    answers: [{ image: 'any_image', answer: 'any_answer' }],
    date: new Date().toLocaleDateString('pt-BR')
  }

)

const MockLoadSurveyResultRepository = (): LoadSurveyResultRepository => {
  class LoadSurveyResultRepositoryStub implements LoadSurveyResultRepository {
    async LoadBySurveyId (survey_id: string): Promise<SurveyResult> {
      return Promise.resolve(MockSurveyResult())
    }
  }
  return new LoadSurveyResultRepositoryStub()
}

const MockLoadSurveyByIdRepository = (): LoadSurveyByIdRepository => {
  class LoadSurveyByIdRepositoryStub implements LoadSurveyByIdRepository {
    async LoadById (id: string): Promise<Surveys> {
      return Promise.resolve(MockSurveys())
    }
  }
  return new LoadSurveyByIdRepositoryStub()
}

type SutTypes = {
  Sut: LoadSurveyResultService,
  LoadSurveyResultRepositoryStub: LoadSurveyResultRepository,
  LoadSurveyByIdRepositoryStub: LoadSurveyByIdRepository
}

const makeSut = (): SutTypes => {
  const LoadSurveyByIdRepositoryStub = MockLoadSurveyByIdRepository()
  const LoadSurveyResultRepositoryStub = MockLoadSurveyResultRepository()
  const Sut = new LoadSurveyResultService(LoadSurveyResultRepositoryStub, LoadSurveyByIdRepositoryStub)
  return { Sut, LoadSurveyResultRepositoryStub, LoadSurveyByIdRepositoryStub }
}

describe('Load Survey Result UseCase', () => {
  describe('#LoadSurveyResultRepository', () => {
    test('Should call LoadSurveyResultRepository with correct survey_id', async () => {
      const { Sut, LoadSurveyResultRepositoryStub } = makeSut()
      const LoadBySurveyIdSpy = jest.spyOn(LoadSurveyResultRepositoryStub, 'LoadBySurveyId')
      await Sut.Load('any_survey_id')
      expect(LoadBySurveyIdSpy).toHaveBeenCalledWith('any_survey_id')
    })

    test('Should return a SurveyResult if LoadSurveyResultRepository succeeds', async () => {
      const { Sut } = makeSut()
      const SurveyResult = await Sut.Load('any_survey_id')
      expect(SurveyResult).toEqual(MockSurveyResult())
    })

    test('Should throw if LoadSurveyResultRepository throws', async () => {
      const { Sut, LoadSurveyResultRepositoryStub } = makeSut()
      jest.spyOn(LoadSurveyResultRepositoryStub, 'LoadBySurveyId').mockRejectedValueOnce(new Error())
      const PromiseRejected = Sut.Load('any_survey_id')
      await expect(PromiseRejected).rejects.toThrow()
    })

    test('Should call LoadSurveyByIdRepository if LoadSurveyResultRepository returns null', async () => {
      const {
        Sut,
        LoadSurveyResultRepositoryStub,
        LoadSurveyByIdRepositoryStub
      } = makeSut()
      jest.spyOn(LoadSurveyResultRepositoryStub, 'LoadBySurveyId').mockResolvedValueOnce(null)
      const LoadByIdSpy = jest.spyOn(LoadSurveyByIdRepositoryStub, 'LoadById')
      await Sut.Load('any_survey_id')
      expect(LoadByIdSpy).toHaveBeenCalledWith('any_survey_id')
    })

    test('Should return SurveyResult with all answers with count and percent zeroed', async () => {
      const { Sut, LoadSurveyResultRepositoryStub } = makeSut()
      const SurveyResultWithCountZero = MockSurveyResult()
      jest.spyOn(LoadSurveyResultRepositoryStub, 'LoadBySurveyId').mockResolvedValueOnce(null)
      const SurveyResult = await Sut.Load('any_survey_id')
      expect(SurveyResult).toEqual(
        {
          ...SurveyResultWithCountZero,
          answers: [{ answer: 'any_answer', image: 'any_image', count: 0, percent: 0 }]
        })
    })
  })
})
