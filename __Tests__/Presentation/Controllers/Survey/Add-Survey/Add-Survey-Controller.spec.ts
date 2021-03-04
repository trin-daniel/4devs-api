import { AddSurveyUseCase } from '@Application/Use-Cases/Survey/Add-Survey-Use-Case'
import { AddSurveyController } from '@Presentation/Controllers/Survey/Add-Survey/Add-Survey-Controller'
import { Request, Validation } from '@Presentation/Protocols'
import { BadRequest, NoContent, ServerErrorHelper } from '@Presentation/Helpers/Http-Helper'
import { SurveyDTO } from '@Presentation/DTOS'
import Faker from 'faker'

interface SutTypes {
  Sut: AddSurveyController,
  ValidationStub: Validation,
  AddSurveyUseCaseStub: AddSurveyUseCase
}

const MockRequest = (): Request<SurveyDTO> => ({
  body: {
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
})
const MOCK_REQUEST_INSTANCE = MockRequest()

const MockValidation = (): Validation => {
  class ValidationStub implements Validation {
    Validate (input: { [key: string]: any }): Error {
      return null
    }
  }
  return new ValidationStub()
}

const MockAddSurveyUseCase = (): AddSurveyUseCase => {
  class AddSurveyUseCaseStub implements AddSurveyUseCase {
    public async Add (data: SurveyDTO): Promise<void> {
      return Promise.resolve()
    }
  }
  return new AddSurveyUseCaseStub()
}

const MakeSut = (): SutTypes => {
  const AddSurveyUseCaseStub = MockAddSurveyUseCase()
  const ValidationStub = MockValidation()
  const Sut = new AddSurveyController(ValidationStub, AddSurveyUseCaseStub)
  return { Sut, ValidationStub, AddSurveyUseCaseStub }
}

describe('Add Survey Controller', () => {
  describe('#Validation', () => {
    test('Should call Validation with correct values', async () => {
      const { Sut, ValidationStub } = MakeSut()
      const ValidateSpy = jest.spyOn(ValidationStub, 'Validate')
      const Request = MockRequest()
      const Data = Object.assign({}, Request.body, delete Request.body.date)
      await Sut.handle(Request)
      expect(ValidateSpy).toHaveBeenCalledWith(Data)
    })

    test('Should return 400 if Validation returns an error', async () => {
      const { Sut, ValidationStub } = MakeSut()
      jest.spyOn(ValidationStub, 'Validate').mockReturnValueOnce(new Error())
      const response = await Sut.handle(MOCK_REQUEST_INSTANCE)
      expect(response).toEqual(BadRequest(new Error()))
    })
  })

  describe('#AddSurveyUseCase', () => {
    test('Should call AddSurveyUseCase with correct values', async () => {
      const { Sut, AddSurveyUseCaseStub } = MakeSut()
      const AddSpy = jest.spyOn(AddSurveyUseCaseStub, 'Add')
      await Sut.handle(MOCK_REQUEST_INSTANCE)
      expect(AddSpy).toHaveBeenCalledWith(MOCK_REQUEST_INSTANCE.body)
    })

    test('Should return 500 if AddSurveyUseCase throws exception', async () => {
      const { Sut, AddSurveyUseCaseStub } = MakeSut()
      jest.spyOn(AddSurveyUseCaseStub, 'Add').mockReturnValueOnce(Promise.reject(new Error()))
      const Response = await Sut.handle(MOCK_REQUEST_INSTANCE)
      expect(Response).toEqual(ServerErrorHelper(new Error()))
    })

    test('Should return 204 if AddSurveyUseCase succeeds', async () => {
      const { Sut } = MakeSut()
      const Response = await Sut.handle(MOCK_REQUEST_INSTANCE)
      expect(Response).toEqual(NoContent())
    })
  })
})
