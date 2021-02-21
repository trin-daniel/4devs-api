import { SurveyDTO } from '@Application/DTOS'
import { AddSurveyUseCase } from '@Application/Use-Cases/Survey/Add-Survey-Use-Case'
import { AddSurveyController } from '@Presentation/Controllers/Survey/Add-Survey/Add-Survey-Controller'
import { Request, Validation } from '@Presentation/Protocols'
import { BadRequest, NoContent, ServerErrorHelper } from '@Presentation/Helpers/Http-Helper'
import MockDate from 'mockdate'

const MockRequest = (): Request => ({
  body:
  {
    question: 'any_question',
    answers:
     [
       {
         image: 'any_image',
         answer: 'any_answer'
       }
     ],
    date: new Date().toLocaleDateString('pt-br')
  }
})

const MockValidationComponent = (): Validation => {
  class ValidationComponentStub implements Validation {
    Validate (input: { [key: string]: any }): Error {
      return null
    }
  }
  return new ValidationComponentStub()
}

const MockAddSurveyUseCaseStub = (): AddSurveyUseCase => {
  class AddSurveyUseCaseStub implements AddSurveyUseCase {
    public async Add (data: SurveyDTO): Promise<void> {
      return Promise.resolve()
    }
  }
  return new AddSurveyUseCaseStub()
}

type SutTypes = {Sut: AddSurveyController, ValidationComponentStub: Validation, AddSurveyUseCaseStub: AddSurveyUseCase}

const makeSut = (): SutTypes => {
  const AddSurveyUseCaseStub = MockAddSurveyUseCaseStub()
  const ValidationComponentStub = MockValidationComponent()
  const Sut = new AddSurveyController(ValidationComponentStub, AddSurveyUseCaseStub)
  return { Sut, ValidationComponentStub, AddSurveyUseCaseStub }
}

describe('Add Survey Controller', () => {
  beforeAll(() => MockDate.set(new Date()))
  afterAll(() => MockDate.reset())

  describe('#Validation', () => {
    test('Should call Validation with correct values', async () => {
      const { Sut, ValidationComponentStub } = makeSut()
      const ValidateSpy = jest.spyOn(ValidationComponentStub, 'Validate')
      const Request = MockRequest()
      const Data = Object.assign({}, Request.body, delete Request.body.date)
      await Sut.handle(Request)
      expect(ValidateSpy).toHaveBeenCalledWith(Data)
    })

    test('Should return 400 if Validation returns an error', async () => {
      const { Sut, ValidationComponentStub } = makeSut()
      jest.spyOn(ValidationComponentStub, 'Validate').mockReturnValueOnce(new Error())
      const response = await Sut.handle(MockRequest())
      expect(response).toEqual(BadRequest(new Error()))
    })
  })

  describe('#AddSurveyUseCase', () => {
    test('Should call AddSurveyUseCase with correct values', async () => {
      const { Sut, AddSurveyUseCaseStub } = makeSut()
      const AddSpy = jest.spyOn(AddSurveyUseCaseStub, 'Add')
      const { body } = MockRequest()
      await Sut.handle({ body })
      expect(AddSpy).toHaveBeenCalledWith(body)
    })

    test('Should return 500 if AddSurveyUseCase throws exception', async () => {
      const { Sut, AddSurveyUseCaseStub } = makeSut()
      jest.spyOn(AddSurveyUseCaseStub, 'Add').mockReturnValueOnce(Promise.reject(new Error()))
      const Response = await Sut.handle(MockRequest())
      expect(Response).toEqual(ServerErrorHelper(new Error()))
    })

    test('Should return 204 if AddSurveyUseCase succeeds', async () => {
      const { Sut } = makeSut()
      const Response = await Sut.handle(MockRequest())
      expect(Response).toEqual(NoContent())
    })
  })
})
