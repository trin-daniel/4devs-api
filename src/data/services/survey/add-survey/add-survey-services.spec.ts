import { SurveyDTO } from '@domain/dtos'
import { AddSurveyServices } from '@data/services/survey/add-survey/add-survey-services'
import { AddSurveyRepository } from '@data/contracts'
import { set, reset } from 'mockdate'

const mockAddSurveyRepository = (): AddSurveyRepository => {
  class AddSurveyRepositoryStub implements AddSurveyRepository {
    add (data: SurveyDTO): Promise<void> {
      return Promise.resolve()
    }
  }
  return new AddSurveyRepositoryStub()
}

const mockSurveyDTO = (): SurveyDTO => ({
  question: 'any_question',
  answers:
  [
    {
      image: 'any_images',
      answer: 'any_answer'
    }
  ],
  date: new Date()
})

interface SutTypes {
  sut: AddSurveyServices
  addSurveyRepositoryStub: AddSurveyRepository
}

const makeSut = (): SutTypes => {
  const addSurveyRepositoryStub = mockAddSurveyRepository()
  const sut = new AddSurveyServices(addSurveyRepositoryStub)
  return { sut, addSurveyRepositoryStub }
}

describe('Add Survey Services', () => {
  beforeAll(() => set(new Date()))
  afterAll(() => reset())

  describe('#AddSurveyRepository', () => {
    test('Should call AddSurveyRepository with correct values', async () => {
      const { sut, addSurveyRepositoryStub } = makeSut()
      const addSpy = jest.spyOn(addSurveyRepositoryStub, 'add')
      const survey = mockSurveyDTO()
      await sut.add(survey)
      expect(addSpy).toHaveBeenCalledWith(survey)
    })

    test('Should throw if AddSurveyRepository throws', async () => {
      const { sut, addSurveyRepositoryStub } = makeSut()
      jest.spyOn(addSurveyRepositoryStub, 'add').mockReturnValueOnce(Promise.reject(new Error()))
      const survey = mockSurveyDTO()
      const promise = sut.add(survey)
      await expect(promise).rejects.toThrow()
    })
  })
})
