import { SurveyResultDTO } from '@Application/DTOS'
import { SurveyResult } from '@Application/Entities'
import { SaveSurveyResultService } from '@Data/Services/Survey-Result/Save-Survey-Result/Save-Survey-Result-Service'
import {
  LoadSurveyResultRepository,
  SaveSurveyResultRepository
} from '@Data/Protocols/Database/Survey'
import Faker from 'faker'

interface SutTypes {
  Sut: SaveSurveyResultService,
  SaveSurveyResultRepositoryStub: SaveSurveyResultRepository,
  LoadSurveyResultRepositoryStub: LoadSurveyResultRepository
}

const MockSurveyResult = (): SurveyResult => (
  {
    id: Faker.random.uuid(),
    question: Faker.lorem.paragraph(1),
    survey_id: Faker.random.uuid(),
    answers: [{
      image: Faker.image.imageUrl(),
      answer: Faker.random.word(),
      count: 1,
      percent: 50,
      isCurrentAccountAnswer: true
    }],
    date: new Date().toLocaleDateString('pt-br')
  }
)

const MOCK_SURVEY_RESULT_INSTANCE = MockSurveyResult()

const MockSurveyResultDTO = (): SurveyResultDTO => (
  {
    account_id: Faker.random.uuid(),
    survey_id: MOCK_SURVEY_RESULT_INSTANCE.survey_id,
    answer: MOCK_SURVEY_RESULT_INSTANCE.answers[0].answer,
    date: new Date().toLocaleDateString('pt-br')
  }
)
const MOCK_SURVEY_RESULT_DTO = MockSurveyResultDTO()

const MockSaveSurveyResultRepository = (): SaveSurveyResultRepository => {
  class SaveSurveyResultRepositoryStub implements SaveSurveyResultRepository {
    public async Save (data: SurveyResultDTO): Promise<void> {
      return Promise.resolve()
    }
  }
  return new SaveSurveyResultRepositoryStub()
}

const MockLoadSurveyResultRepository = (): LoadSurveyResultRepository => {
  class LoadSurveyResultRepositoryStub implements LoadSurveyResultRepository {
    async LoadBySurveyId (survey_id: string, account_id: string): Promise<SurveyResult> {
      return Promise.resolve(MOCK_SURVEY_RESULT_INSTANCE)
    }
  }
  return new LoadSurveyResultRepositoryStub()
}

const MakeSut = (): SutTypes => {
  const LoadSurveyResultRepositoryStub = MockLoadSurveyResultRepository()
  const SaveSurveyResultRepositoryStub = MockSaveSurveyResultRepository()
  const Sut = new SaveSurveyResultService(
    SaveSurveyResultRepositoryStub,
    LoadSurveyResultRepositoryStub
  )
  return {
    Sut,
    SaveSurveyResultRepositoryStub,
    LoadSurveyResultRepositoryStub
  }
}

describe('Save Survey Result Service', () => {
  describe('#SaveSurveyResult', () => {
    test('Should call SaveSurveyResultRepository with correct values', async () => {
      const { Sut, SaveSurveyResultRepositoryStub } = MakeSut()
      const SaveSpy = jest.spyOn(SaveSurveyResultRepositoryStub, 'Save')
      await Sut.Save(MOCK_SURVEY_RESULT_DTO)
      expect(SaveSpy).toHaveBeenCalledWith(MOCK_SURVEY_RESULT_DTO)
    })

    test('Should throw if SaveSurveyResultRepository throws', async () => {
      const { Sut, SaveSurveyResultRepositoryStub } = MakeSut()
      jest.spyOn(SaveSurveyResultRepositoryStub, 'Save').mockRejectedValueOnce(new Error())
      const promise = Sut.Save(MOCK_SURVEY_RESULT_DTO)
      await expect(promise).rejects.toThrow()
    })

    test('Should call LoadSurveyResultRepository with correct values', async () => {
      const { Sut, LoadSurveyResultRepositoryStub } = MakeSut()
      const LoadBySurveyIdSpy = jest.spyOn(LoadSurveyResultRepositoryStub, 'LoadBySurveyId')
      await Sut.Save(MOCK_SURVEY_RESULT_DTO)
      expect(LoadBySurveyIdSpy).toHaveBeenCalledWith(MOCK_SURVEY_RESULT_DTO.survey_id, MOCK_SURVEY_RESULT_DTO.account_id)
    })

    test('Should throw if LoadSurveyResultRepository throws', async () => {
      const { Sut, LoadSurveyResultRepositoryStub } = MakeSut()
      jest.spyOn(LoadSurveyResultRepositoryStub, 'LoadBySurveyId').mockRejectedValueOnce(new Error())
      const promise = Sut.Save(MOCK_SURVEY_RESULT_DTO)
      await expect(promise).rejects.toThrow()
    })

    test('Should return a SurveyResult on success', async () => {
      const { Sut } = MakeSut()
      const SurveyResult = await Sut.Save(MOCK_SURVEY_RESULT_DTO)
      expect(SurveyResult).toEqual(MOCK_SURVEY_RESULT_INSTANCE)
    })
  })
})
