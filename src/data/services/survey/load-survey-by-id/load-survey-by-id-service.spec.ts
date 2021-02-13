import { Surveys } from '@domain/entities'
import { LoadSurveyByIdService } from '@data/services/survey/load-survey-by-id/load-survey-by-id-service'
import { LoadSurveyByIdRepository } from '@data/contracts'
import { reset, set } from 'mockdate'

type SutTypes = {
  sut: LoadSurveyByIdService,
  loadSurveyByIdRepositoryStub: LoadSurveyByIdRepository
}

const mockSurveys = (): Surveys => (

  {
    id: '507f1f77bcf86cd799439011',
    question: 'any_question',
    answers: [{ image: 'any_image', answer: 'any_answer' }],
    date: new Date()
  }

)

const mockLoadSurveyByIdRepository = (): LoadSurveyByIdRepository => {
  class LoadSurveyByIdRepositoryStub implements LoadSurveyByIdRepository {
    async loadById (id: string): Promise<Surveys> {
      return Promise.resolve(mockSurveys())
    }
  }
  return new LoadSurveyByIdRepositoryStub()
}

const makeSut = (): SutTypes => {
  const loadSurveyByIdRepositoryStub = mockLoadSurveyByIdRepository()
  const sut = new LoadSurveyByIdService(loadSurveyByIdRepositoryStub)
  return { sut, loadSurveyByIdRepositoryStub }
}

describe('Load Survey By Id Service', () => {
  beforeAll(() => set(new Date()))
  afterAll(() => reset())

  describe('#LoadSurveyByIdRepository', () => {
    test('Should call LoadSurveyByIdRepository with correct id', async () => {
      const { sut, loadSurveyByIdRepositoryStub } = makeSut()
      const loadByIdSpy = jest.spyOn(loadSurveyByIdRepositoryStub, 'loadById')
      await sut.load('any_id')
      expect(loadByIdSpy).toHaveBeenCalledWith('any_id')
    })

    test('Should return a survey when successful', async () => {
      const { sut } = makeSut()
      const survey = await sut.load('any_id')
      expect(survey).toEqual(mockSurveys())
    })

    test('Should throw if LoadSurveyByIdRepository throws', async () => {
      const { sut, loadSurveyByIdRepositoryStub } = makeSut()
      jest.spyOn(loadSurveyByIdRepositoryStub, 'loadById').mockRejectedValue(new Error())
      const promise = sut.load('any_id')
      await expect(promise).rejects.toThrow()
    })
  })
})
