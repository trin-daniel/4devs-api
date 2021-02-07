import { SigninController } from './signin-controller'
import { Authentication } from '../../../domain/use-cases/authentication/authentication'
import { AuthenticationDTO } from '../../../domain/data-transfer-objects'
import { Request, Validator } from '../../contracts'
import { ServerError } from '../../errors'
import { badRequest, ok, serverError, unauthorized } from '../../helpers/http-helper'

interface SutTypes {
  sut: SigninController,
  authenticationStub: Authentication,
  validatorStub: Validator
}

const mockRequest = (): Request => ({
  body:
  {
    email: 'any_email@gmail.com',
    password: 'any_password'
  }
})

const mockAuthentication = (): Authentication => {
  class AuthenticationStub implements Authentication {
    async auth (data: AuthenticationDTO): Promise<string> {
      return Promise.resolve('any_token')
    }
  }
  return new AuthenticationStub()
}

const mockValidator = (): Validator => {
  class ValidatorStub implements Validator {
    validate (input: { [key: string]: any }): Error {
      return null
    }
  }
  return new ValidatorStub()
}

const makeSut = (): SutTypes => {
  const validatorStub = mockValidator()
  const authenticationStub = mockAuthentication()
  const sut = new SigninController(validatorStub, authenticationStub)
  return { sut, authenticationStub, validatorStub }
}

describe('Signin Controller', () => {
  test('Should call Validator with correct value', async () => {
    const { sut, validatorStub } = makeSut()
    const validateSpy = jest.spyOn(validatorStub, 'validate')
    const request = mockRequest()
    await sut.handle(request)
    expect(validateSpy).toHaveBeenCalledWith(request.body)
  })

  test('Should return 400 if validator returns an error', async () => {
    const { sut, validatorStub } = makeSut()
    jest.spyOn(validatorStub, 'validate').mockReturnValueOnce(new Error())
    const request = mockRequest()
    const response = await sut.handle(request)
    expect(response).toEqual(badRequest(new Error()))
  })

  test('Should call Authentication with correct credentials', async () => {
    const { sut, authenticationStub } = makeSut()
    const authSpy = jest.spyOn(authenticationStub, 'auth')
    const request = mockRequest()
    await sut.handle(request)
    expect(authSpy).toHaveBeenCalledWith(request.body)
  })

  test('Should return 401 if invalid credentials are provided', async () => {
    const { sut, authenticationStub } = makeSut()
    jest.spyOn(authenticationStub, 'auth').mockReturnValueOnce(Promise.resolve(null))
    const request = mockRequest()
    const response = await sut.handle(request)
    expect(response).toEqual(unauthorized())
  })

  test('Should return 200 if valid credentials are provided', async () => {
    const { sut } = makeSut()
    const request = mockRequest()
    const response = await sut.handle(request)
    expect(response).toEqual(ok({ token: 'any_token' }))
  })

  test('Should return 500 if Authentication throws exception', async () => {
    const { sut, authenticationStub } = makeSut()
    jest.spyOn(authenticationStub, 'auth').mockReturnValueOnce(Promise.reject(new Error()))
    const request = mockRequest()
    const response = await sut.handle(request)
    expect(response).toEqual(serverError(new ServerError()))
  })
})
