import { SignupController } from './signup-controller'

describe('Signup Controller', () => {
  test('Should return 400 if no name is provided', () => {
    const sut = new SignupController()
    const request =
    {
      body:
      {
        email: 'any_email@gmail.com.br',
        password: 'any_password',
        confirmation: 'any_password'
      }
    }
    const response = sut.handle(request)
    expect(response.statusCode).toBe(400)
    expect(response.body).toEqual(new Error())
  })
})
