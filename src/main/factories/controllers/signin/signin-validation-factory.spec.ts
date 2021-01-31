import { signinValidationFactory } from './signin-validation-factory'
import { Validator } from '../../../../presentation/contracts/validator'
import { EmailValidator } from '../../../../presentation/contracts/email-validator'
import { EmailFieldValidator, RequiredFieldValidator, ValidatorComposite } from '../../../../validation/validators'

const mockEmailValidator = (): EmailValidator => {
  class EmailValidatorStub implements EmailValidator {
    isEmail (email: string): boolean {
      return true
    }
  }
  return new EmailValidatorStub()
}

jest.mock('../../../../validation/validators/validator-composite')

describe('Signin Validation Factory', () => {
  test('Should call ValidatorComposite with all validators', () => {
    signinValidationFactory()
    const validators: Validator[] = []
    const requiredFields = ['email', 'password']
    for (const field of requiredFields) {
      validators.push(new RequiredFieldValidator(field))
    }
    validators.push(new EmailFieldValidator('email', mockEmailValidator()))
    expect(ValidatorComposite).toHaveBeenCalledWith(validators)
  })
})
