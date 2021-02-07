import { AddSurveyServices } from './add-survey-services'
import { SurveyDTO } from '../../../domain/data-transfer-objects'
import { AddSurveyRepository } from '../../contracts'

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
  ]
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
  test('Should call AddSurveyRepository with correct values', async () => {
    const { sut, addSurveyRepositoryStub } = makeSut()
    const addSpy = jest.spyOn(addSurveyRepositoryStub, 'add')
    const survey = mockSurveyDTO()
    await sut.add(survey)
    expect(addSpy).toHaveBeenCalledWith(survey)
  })
})
