import { AuthMiddleware } from './auth-middleware'
import { LoadAccountByToken } from '../../domain/use-cases/account/load-account-by-token'
import { Request } from '../contracts'
import { forbidden } from '../helpers/http-helper'
import { AccessDeniedError } from '../errors'
import { Account } from '../../domain/entities'

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
    async load (token: string): Promise<Account> {
      return Promise.resolve(mockAccount())
    }
  }
  return new LoadAccountByTokenStub()
}

const makeSut = (): SutTypes => {
  const loadAccountByTokenStub = mockLoadAccountByToken()
  const sut = new AuthMiddleware(loadAccountByTokenStub)
  return { sut, loadAccountByTokenStub }
}

describe('Auth Middleware', () => {
  test('Should call LoadAccountByToken with the correct token property', async () => {
    const { sut, loadAccountByTokenStub } = makeSut()
    const loadSpy = jest.spyOn(loadAccountByTokenStub, 'load')
    const request = mockRequest()
    await sut.handle(request)
    expect(loadSpy).toHaveBeenCalledWith(request.headers['x-access-token'])
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
})
