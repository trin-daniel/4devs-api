import { AddSurveyController } from './add-survey-controller'
import { AddSurvey } from '../../../../domain/use-cases/survey/add-survey'
import { SurveyDTO } from '../../../../domain/dtos'
import { Request, Validator } from '../../../contracts'
import { badRequest, noContent, serverError } from '../../../helpers/http-helper'

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

const mockAddSurveyStub = (): AddSurvey => {
  class AddSurveyStub implements AddSurvey {
    public async add (data: SurveyDTO): Promise<void> {
      return Promise.resolve()
    }
  }
  return new AddSurveyStub()
}

interface SutTypes {
  sut: AddSurveyController,
  validatorStub: Validator,
  addSurveyStub: AddSurvey
}

const makeSut = (): SutTypes => {
  const addSurveyStub = mockAddSurveyStub()
  const validatorStub = mockValidator()
  const sut = new AddSurveyController(validatorStub, addSurveyStub)
  return { sut, validatorStub, addSurveyStub }
}

describe('Add Survey Controller', () => {
  test('Should call Validator with correct values', async () => {
    const { sut, validatorStub } = makeSut()
    const validateSpy = jest.spyOn(validatorStub, 'validate')
    const request = mockRequest()
    await sut.handle(request)
    expect(validateSpy).toHaveBeenCalledWith(request.body)
  })

  test('Should return 400 if Validator returns an error', async () => {
    const { sut, validatorStub } = makeSut()
    jest.spyOn(validatorStub, 'validate').mockReturnValueOnce(new Error())
    const request = mockRequest()
    const response = await sut.handle(request)
    expect(response).toEqual(badRequest(new Error()))
  })

  test('Should call AddSurvey with correct values', async () => {
    const { sut, addSurveyStub } = makeSut()
    const addSpy = jest.spyOn(addSurveyStub, 'add')
    const request = mockRequest()
    await sut.handle(request)
    expect(addSpy).toHaveBeenCalledWith(request.body)
  })

  test('Should return 500 if AddSurvey throws exception', async () => {
    const { sut, addSurveyStub } = makeSut()
    jest.spyOn(addSurveyStub, 'add').mockReturnValueOnce(Promise.reject(new Error()))
    const request = mockRequest()
    const response = await sut.handle(request)
    expect(response).toEqual(serverError(new Error()))
  })

  test('Should return 204 if AddSurvey succeeds', async () => {
    const { sut } = makeSut()
    const request = mockRequest()
    const response = await sut.handle(request)
    expect(response).toEqual(noContent())
  })
})
