import { SurveyResultDTO } from '@domain/dtos'
import { SurveyResult } from '@domain/entities'
import { SaveSurveyResultService } from '@data/services/survey/save-survey-result/save-survey-result-service'
import { SaveSurveyResultRepository } from '@data/contracts'
import { reset, set } from 'mockdate'

type SutTypes = {
  sut: SaveSurveyResultService,
  saveSurveyResultRepositoryStub: SaveSurveyResultRepository
}

const mockSurveyResult = (): SurveyResult => (
  {
    id: '507f1f77bcf86cd799439011',
    account_id: 'any_id',
    survey_id: 'any_survey_id',
    answer: 'any_answer',
    date: new Date()
  }
)

const mockSurveyResultDTO = (): SurveyResultDTO => (
  {
    account_id: 'any_id',
    survey_id: 'any_survey_id',
    answer: 'any_answer',
    date: new Date()
  }
)

const mockSaveSurveyResultRepository = (): SaveSurveyResultRepository => {
  class SaveSurveyResultRepositoryStub implements SaveSurveyResultRepository {
    public async save (data: SurveyResultDTO): Promise<SurveyResult> {
      return Promise.resolve(mockSurveyResult())
    }
  }
  return new SaveSurveyResultRepositoryStub()
}

const makeSut = (): SutTypes => {
  const saveSurveyResultRepositoryStub = mockSaveSurveyResultRepository()
  const sut = new SaveSurveyResultService(saveSurveyResultRepositoryStub)
  return { sut, saveSurveyResultRepositoryStub }
}

describe('Save Survey Result Service', () => {
  beforeAll(() => set(new Date()))
  afterAll(() => reset())

  describe('#SaveSurveyResult', () => {
    test('Should call SaveSurveyResultRepository with correct values', async () => {
      const { sut, saveSurveyResultRepositoryStub } = makeSut()
      const saveSpy = jest.spyOn(saveSurveyResultRepositoryStub, 'save')
      await sut.save(mockSurveyResultDTO())
      expect(saveSpy).toHaveBeenCalledWith(mockSurveyResultDTO())
    })

    test('Should throw if SaveSurveyResultRepository throws', async () => {
      const { sut, saveSurveyResultRepositoryStub } = makeSut()
      jest.spyOn(saveSurveyResultRepositoryStub, 'save').mockRejectedValueOnce(new Error())
      const promise = sut.save(mockSurveyResultDTO())
      await expect(promise).rejects.toThrow()
    })

    test('Should return a SurveyResult on success', async () => {
      const { sut } = makeSut()
      const surveyResult = await sut.save(mockSurveyResultDTO())
      expect(surveyResult).toEqual(mockSurveyResult())
    })
  })
})
