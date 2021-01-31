import { SignupController } from './signup-controller'
import { Account } from '../../../domain/entities'
import { AddAccount } from '../../../domain/use-cases/add-account'
import { AccountDTO } from '../../../domain/data-transfer-objects'
import { ServerError } from '../../errors'
import { Request } from '../../contracts'
import { badRequest, ok, serverError } from '../../helpers/http-helper'
import { Validator } from '../../contracts/validator'

interface SutTypes {
  sut: SignupController,
  addAccountStub: AddAccount,
  validatorStub: Validator
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

const makeSut = (): SutTypes => {
  const validatorStub = mockValidator()
  const addAccountStub = mockAddAccount()
  const sut = new SignupController(validatorStub, addAccountStub)
  return { sut, validatorStub, addAccountStub }
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

  test('Should return 500 if AddAccount throws', async () => {
    const { sut, addAccountStub } = makeSut()
    jest.spyOn(addAccountStub, 'add').mockImplementationOnce(async () => Promise.reject(new Error()))
    const request = mockRequest()
    const response = await sut.handle(request)
    expect(response).toEqual(serverError(new ServerError()))
  })

  test('Should return 200 if valid data is provided', async () => {
    const { sut } = makeSut()
    const request = mockRequest()
    const response = await sut.handle(request)
    const result = Object.assign({}, request.body,
      {
        id: '507f1f77bcf86cd799439011',
        password: 'hash'
      },
      delete request.body.confirmation
    )
    expect(response).toEqual(ok(result))
  })
})
