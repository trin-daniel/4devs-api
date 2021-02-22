import { SurveyResultDTO } from '@Application/DTOS'
import { SurveyResult } from '@Application/Entities'
import { SaveSurveyResultService } from '@Data/Services/Survey-Result/Save-Survey-Result/Save-Survey-Result-Service'
import { SaveSurveyResultRepository } from '@Data/Protocols/Database'
import MockDate from 'mockdate'

type SutTypes = { Sut: SaveSurveyResultService, SaveSurveyResultRepositoryStub: SaveSurveyResultRepository }

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

const MockSurveyResultDTO = (): SurveyResultDTO => (
  {
    account_id: 'any_id',
    survey_id: 'any_survey_id',
    answer: 'any_answer',
    date: new Date().toLocaleDateString('pt-br')
  }
)

const MockSaveSurveyResultRepository = (): SaveSurveyResultRepository => {
  class SaveSurveyResultRepositoryStub implements SaveSurveyResultRepository {
    public async Save (data: SurveyResultDTO): Promise<SurveyResult> {
      return Promise.resolve(MockSurveyResult())
    }
  }
  return new SaveSurveyResultRepositoryStub()
}

const makeSut = (): SutTypes => {
  const SaveSurveyResultRepositoryStub = MockSaveSurveyResultRepository()
  const Sut = new SaveSurveyResultService(SaveSurveyResultRepositoryStub)
  return { Sut, SaveSurveyResultRepositoryStub }
}

describe('Save Survey Result Service', () => {
  beforeAll(() => MockDate.set(new Date()))
  afterAll(() => MockDate.reset())

  describe('#SaveSurveyResult', () => {
    test('Should call SaveSurveyResultRepository with correct values', async () => {
      const { Sut, SaveSurveyResultRepositoryStub } = makeSut()
      const SaveSpy = jest.spyOn(SaveSurveyResultRepositoryStub, 'Save')
      await Sut.Save(MockSurveyResultDTO())
      expect(SaveSpy).toHaveBeenCalledWith(MockSurveyResultDTO())
    })

    test('Should throw if SaveSurveyResultRepository throws', async () => {
      const { Sut, SaveSurveyResultRepositoryStub } = makeSut()
      jest.spyOn(SaveSurveyResultRepositoryStub, 'Save').mockRejectedValueOnce(new Error())
      const promise = Sut.Save(MockSurveyResultDTO())
      await expect(promise).rejects.toThrow()
    })

    test('Should return a SurveyResult on success', async () => {
      const { Sut } = makeSut()
      const SurveyResult = await Sut.Save(MockSurveyResultDTO())
      expect(SurveyResult).toEqual(MockSurveyResult())
    })
  })
})
