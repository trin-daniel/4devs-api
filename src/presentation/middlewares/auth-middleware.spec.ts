import { AuthMiddleware } from './auth-middleware'
import { Account } from '../../domain/entities'
import { LoadAccountByToken } from '../../domain/use-cases/account/load-account-by-token'
import { Request } from '../contracts'
import { forbidden, ok, serverError } from '../helpers/http-helper'
import { AccessDeniedError } from '../errors'

interface SutTypes {
  sut: AuthMiddleware,
  loadAccountByTokenStub: LoadAccountByToken
}

const mockRequest = (): Request => (
  {
    headers:
    {
      'x-access-token': 'any_token'
    }
  }
)

const mockAccount = (): Account => (
  {
    id: '507f1f77bcf86cd799439011',
    name: 'any_name',
    email: 'any_email@gmail.com',
    password: 'hash'
  }
)

const mockLoadAccountByToken = (): LoadAccountByToken => {
  class LoadAccountByTokenStub implements LoadAccountByToken {
    async load (token: string, role?: string): Promise<Account> {
      return Promise.resolve(mockAccount())
    }
  }
  return new LoadAccountByTokenStub()
}

const makeSut = (role?: string): SutTypes => {
  const loadAccountByTokenStub = mockLoadAccountByToken()
  const sut = new AuthMiddleware(loadAccountByTokenStub, role)
  return { sut, loadAccountByTokenStub }
}

describe('Auth Middleware', () => {
  test('Should call LoadAccountByToken with the correct values', async () => {
    const role = 'admin'
    const { sut, loadAccountByTokenStub } = makeSut(role)
    const loadSpy = jest.spyOn(loadAccountByTokenStub, 'load')
    const request = mockRequest()
    await sut.handle(request)
    expect(loadSpy).toHaveBeenCalledWith(request.headers['x-access-token'], role)
  })

  test('Should return 403 if no x-access-token property exists in headers', async () => {
    const { sut } = makeSut()
    const request = mockRequest()
    const requestWithoutToken = Object.assign({}, request.headers, delete request.headers['x-access-token'])
    const response = await sut.handle(requestWithoutToken)
    expect(response).toEqual(forbidden(new AccessDeniedError()))
  })

  test('Should return 403 if LoadAccountByToken returns null', async () => {
    const { sut, loadAccountByTokenStub } = makeSut()
    jest.spyOn(loadAccountByTokenStub, 'load').mockReturnValueOnce(Promise.resolve(null))
    const request = mockRequest()
    const response = await sut.handle(request)
    expect(response).toEqual(forbidden(new AccessDeniedError()))
  })

  test('Should return 200 if LoadAccountByToken returns an account', async () => {
    const { sut } = makeSut()
    const request = mockRequest()
    const response = await sut.handle(request)
    expect(response).toEqual(ok({ account_id: '507f1f77bcf86cd799439011' }))
  })

  test('Should return 500 if LoadAccountByToken throws exception', async () => {
    const { sut, loadAccountByTokenStub } = makeSut()
    jest.spyOn(loadAccountByTokenStub, 'load').mockReturnValueOnce(Promise.reject(new Error()))
    const request = mockRequest()
    const response = await sut.handle(request)
    expect(response).toEqual(serverError(new Error()))
  })
})
