import { SurveyDTO } from '@Application/DTOS'
import { AddSurveyRepository } from '@Data/Protocols/Database/Survey'
import { AddSurveyServices } from '@Data/Services/Survey/Add-Survey/Add-Survey-Services'
import MockDate from 'mockdate'

const MockAddSurveyRepository = (): AddSurveyRepository => {
  class AddSurveyRepositoryStub implements AddSurveyRepository {
    Add (data: SurveyDTO): Promise<void> {
      return Promise.resolve()
    }
  }
  return new AddSurveyRepositoryStub()
}

const MockSurveyDTO = (): SurveyDTO => ({
  question: 'any_question',
  answers:
  [
    {
      image: 'any_images',
      answer: 'any_answer'
    }
  ],
  date: new Date().toLocaleDateString('pt-br')
})

type SutTypes = {Sut: AddSurveyServices, AddSurveyRepositoryStub: AddSurveyRepository}

const makeSut = (): SutTypes => {
  const AddSurveyRepositoryStub = MockAddSurveyRepository()
  const Sut = new AddSurveyServices(AddSurveyRepositoryStub)
  return { Sut, AddSurveyRepositoryStub }
}

describe('Add Survey Services', () => {
  beforeAll(() => MockDate.set(new Date()))
  afterAll(() => MockDate.reset())

  describe('#AddSurveyRepository', () => {
    test('Should call AddSurveyRepository with correct values', async () => {
      const { Sut, AddSurveyRepositoryStub } = makeSut()
      const AddSpy = jest.spyOn(AddSurveyRepositoryStub, 'Add')
      await Sut.Add(MockSurveyDTO())
      expect(AddSpy).toHaveBeenCalledWith(MockSurveyDTO())
    })

    test('Should throw if AddSurveyRepository throws', async () => {
      const { Sut, AddSurveyRepositoryStub } = makeSut()
      jest.spyOn(AddSurveyRepositoryStub, 'Add').mockRejectedValueOnce(new Error())
      const PromiseRejected = Sut.Add(MockSurveyDTO())
      await expect(PromiseRejected).rejects.toThrow()
    })
  })
})
