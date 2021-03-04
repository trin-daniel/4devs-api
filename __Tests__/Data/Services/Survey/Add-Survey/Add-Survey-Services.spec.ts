import { SurveyDTO } from '@Application/DTOS'
import { AddSurveyRepository } from '@Data/Protocols/Database/Survey'
import { AddSurveyServices } from '@Data/Services/Survey/Add-Survey/Add-Survey-Services'
import Faker from 'faker'

const MockAddSurveyRepository = (): AddSurveyRepository => {
  class AddSurveyRepositoryStub implements AddSurveyRepository {
    Add (data: SurveyDTO): Promise<void> {
      return Promise.resolve()
    }
  }
  return new AddSurveyRepositoryStub()
}

const MockSurveyDTO = (): SurveyDTO => (
  {

    question: Faker.lorem.paragraph(1),
    answers:
     [
       {
         image: Faker.image.imageUrl(),
         answer: Faker.random.word()
       }
     ],
    date: new Date().toLocaleDateString('pt-br')
  }
)

const MOCK_SURVEY_INSTANCE = MockSurveyDTO()

interface SutTypes {
  Sut: AddSurveyServices,
  AddSurveyRepositoryStub: AddSurveyRepository
}

const MakeSut = (): SutTypes => {
  const AddSurveyRepositoryStub = MockAddSurveyRepository()
  const Sut = new AddSurveyServices(AddSurveyRepositoryStub)
  return { Sut, AddSurveyRepositoryStub }
}

describe('Add Survey Services', () => {
  describe('#AddSurveyRepository', () => {
    test('Should call AddSurveyRepository with correct values', async () => {
      const { Sut, AddSurveyRepositoryStub } = MakeSut()
      const AddSpy = jest.spyOn(AddSurveyRepositoryStub, 'Add')
      await Sut.Add(MOCK_SURVEY_INSTANCE)
      expect(AddSpy).toHaveBeenCalledWith(MOCK_SURVEY_INSTANCE)
    })

    test('Should throw if AddSurveyRepository throws', async () => {
      const { Sut, AddSurveyRepositoryStub } = MakeSut()
      jest.spyOn(AddSurveyRepositoryStub, 'Add').mockRejectedValueOnce(new Error())
      const PromiseRejected = Sut.Add(MOCK_SURVEY_INSTANCE)
      await expect(PromiseRejected).rejects.toThrow()
    })
  })
})
