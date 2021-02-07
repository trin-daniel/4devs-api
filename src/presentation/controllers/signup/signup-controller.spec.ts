import { SignupController } from './signup-controller'
import { Account } from '../../../domain/entities'
import { AddAccount } from '../../../domain/use-cases/account/add-account'
import { AccountDTO, AuthenticationDTO } from '../../../domain/dtos'
import { EmailInUseError, ServerError } from '../../errors'
import { Request, Validator } from '../../contracts'
import { badRequest, forbidden, ok, serverError } from '../../helpers/http-helper'
import { Authentication } from '../../../domain/use-cases/authentication/authentication'

interface SutTypes {
  sut: SignupController,
  addAccountStub: AddAccount,
  validatorStub: Validator,
  authenticationStub: Authentication,
}

const mockRequest = (): Request => ({
  body:
  {
    name: 'any_name',
    email: 'any_email@gmail.com',
    password: 'any_password',
    confirmation: 'any_password'
  }
})

const mockAddAccount = (): AddAccount => {
  class AddAccountStub implements AddAccount {
    public async add (data: AccountDTO): Promise<Account> {
      const account =
      {
        id: '507f1f77bcf86cd799439011',
        name: 'any_name',
        email: 'any_email@gmail.com',
        password: 'hash'
      }
      return Promise.resolve(account)
    }
  }
  return new AddAccountStub()
}

const mockValidator = (): Validator => {
  class ValidatorStub implements Validator {
    validate (input: { [key: string]: any }): Error {
      return null
    }
  }
  return new ValidatorStub()
}

const mockAuthentication = (): Authentication => {
  class AuthenticationStub implements Authentication {
    async auth (data: AuthenticationDTO): Promise<string> {
      return Promise.resolve('any_token')
    }
  }
  return new AuthenticationStub()
}

const makeSut = (): SutTypes => {
  const authenticationStub = mockAuthentication()
  const validatorStub = mockValidator()
  const addAccountStub = mockAddAccount()
  const sut = new SignupController(validatorStub, addAccountStub, authenticationStub)
  return { sut, validatorStub, addAccountStub, authenticationStub }
}

describe('Signup Controller', () => {
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

  test('Should call AddAccount with correct values', async () => {
    const { sut, addAccountStub } = makeSut()
    const addSpy = jest.spyOn(addAccountStub, 'add')
    const request = mockRequest()
    await sut.handle(request)
    const data = Object.assign({}, request.body, delete request.body.confirmation)
    expect(addSpy).toHaveBeenCalledWith(data)
  })

  test('Should return 403 if AddAccount returns null', async () => {
    const { sut, addAccountStub } = makeSut()
    jest.spyOn(addAccountStub, 'add').mockReturnValueOnce(Promise.resolve(null))
    const request = mockRequest()
    const response = await sut.handle(request)
    expect(response).toEqual(forbidden(new EmailInUseError()))
  })

  test('Should return 500 if AddAccount throws', async () => {
    const { sut, addAccountStub } = makeSut()
    jest.spyOn(addAccountStub, 'add').mockImplementationOnce(async () => Promise.reject(new Error()))
    const request = mockRequest()
    const response = await sut.handle(request)
    expect(response).toEqual(serverError(new ServerError()))
  })

  test('Should call Authentication with correct credentials', async () => {
    const { sut, authenticationStub } = makeSut()
    const authSpy = jest.spyOn(authenticationStub, 'auth')
    const request = mockRequest()
    const { email, password } = request.body
    await sut.handle(request)
    expect(authSpy).toHaveBeenCalledWith({ email, password })
  })

  test('Should return 500 if Authentication throws exception', async () => {
    const { sut, authenticationStub } = makeSut()
    jest.spyOn(authenticationStub, 'auth').mockReturnValueOnce(Promise.reject(new Error()))
    const request = mockRequest()
    const response = await sut.handle(request)
    expect(response).toEqual(serverError(new ServerError()))
  })

  test('Should return 200 if valid data are provided', async () => {
    const { sut } = makeSut()
    const request = mockRequest()
    const response = await sut.handle(request)
    expect(response).toEqual(ok({ token: 'any_token' }))
  })
})
