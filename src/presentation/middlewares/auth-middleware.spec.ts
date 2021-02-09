import { AuthMiddleware } from './auth-middleware'
import { Request } from '../contracts'
import { forbidden } from '../helpers/http-helper'
import { AccessDeniedError } from '../errors'

interface SutTypes {
  sut: AuthMiddleware,
}

const mockRequest = (): Request => (
  {
    headers:
    {
      'x-access-token': 'any_token'
    }
  }
)

const makeSut = (): SutTypes => {
  const sut = new AuthMiddleware()
  return { sut }
}
describe('Auth Middleware', () => {
  test('Should return 403 if no x-access-token property exists in headers', async () => {
    const { sut } = makeSut()
    const request = mockRequest()
    const requestWithoutToken = Object.assign({}, request.headers, delete request.headers['x-access-token'])
    const response = await sut.handle(requestWithoutToken)
    expect(response).toEqual(forbidden(new AccessDeniedError()))
  })
})
