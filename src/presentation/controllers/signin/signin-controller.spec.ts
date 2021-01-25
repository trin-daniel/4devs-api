import { MissingParamError } from '../../errors'
import { badRequest } from '../../helpers/http-helper'
import { SigninController } from './signin-controller'

interface SutTypes {
  sut: SigninController
}

const makeSut = (): SutTypes => {
  const sut = new SigninController()
  return { sut }
}

describe('Signin Controller', () => {
  test('Should return 400 if no email is provided', async () => {
    const { sut } = makeSut()
    const request =
    {
      body:
      {
        password: '123456'
      }
    }
    const response = await sut.handle(request)
    expect(response).toEqual(badRequest(new MissingParamError('email')))
  })

  test('Should return 400 if no password is provided', async () => {
    const { sut } = makeSut()
    const request =
    {
      body:
      {
        email: 'any_email@gmail.com'
      }
    }
    const response = await sut.handle(request)
    expect(response).toEqual(badRequest(new MissingParamError('password')))
  })
})
