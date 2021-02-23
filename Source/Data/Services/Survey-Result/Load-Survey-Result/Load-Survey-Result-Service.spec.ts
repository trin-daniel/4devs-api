import { SurveyResult } from '@Application/Entities'
import { LoadSurveyResultRepository } from '@Data/Protocols/Database'
import { LoadSurveyResultService } from './Load-Survey-Result-Service'

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

const MockLoadSurveyResultRepository = (): LoadSurveyResultRepository => {
  class LoadSurveyResultRepositoryStub implements LoadSurveyResultRepository {
    async LoadBySurveyId (survey_id: string): Promise<SurveyResult> {
      return Promise.resolve(MockSurveyResult())
    }
  }
  return new LoadSurveyResultRepositoryStub()
}

type SutTypes = {
  Sut: LoadSurveyResultService,
  LoadSurveyResultRepositoryStub: LoadSurveyResultRepository
}

const makeSut = (): SutTypes => {
  const LoadSurveyResultRepositoryStub = MockLoadSurveyResultRepository()
  const Sut = new LoadSurveyResultService(LoadSurveyResultRepositoryStub)
  return { Sut, LoadSurveyResultRepositoryStub }
}

describe('Load Survey Result UseCase', () => {
  describe('#LoadSurveyResultRepository', () => {
    test('Should call LoadSurveyResultRepository with correct survey_id', async () => {
      const { Sut, LoadSurveyResultRepositoryStub } = makeSut()
      const LoadBySurveyIdSpy = jest.spyOn(LoadSurveyResultRepositoryStub, 'LoadBySurveyId')
      await Sut.Load('any_survey_id')
      expect(LoadBySurveyIdSpy).toHaveBeenCalledWith('any_survey_id')
    })
  })
})
