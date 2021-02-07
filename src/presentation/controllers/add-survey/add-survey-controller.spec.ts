import { AddSurveyController } from './add-survey-controller'
import { Request, Validator } from '../../contracts'

const mockRequest = (): Request => ({
  body:
  {
    question: 'any_question',
    answers:
     [
       {
         image: 'any_image',
         answer: 'any_answer'
       }
     ]
  }
})

const mockValidator = (): Validator => {
  class ValidatorStub implements Validator {
    validate (input: { [key: string]: any }): Error {
      return null
    }
  }
  return new ValidatorStub()
}

interface SutTypes {
  sut: AddSurveyController,
  validatorStub: Validator
}

const makeSut = (): SutTypes => {
  const validatorStub = mockValidator()
  const sut = new AddSurveyController(validatorStub)
  return { sut, validatorStub }
}

describe('Add Survey Controller', () => {
  test('Should call Validator with correct values', async () => {
    const { sut, validatorStub } = makeSut()
    const validateSpy = jest.spyOn(validatorStub, 'validate')
    const request = mockRequest()
    await sut.handle(request)
    expect(validateSpy).toHaveBeenCalledWith(request.body)
  })
})
