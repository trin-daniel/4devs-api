import { SignupValidationFactory } from './signup-validation-factory'
import { Validator } from '../../../../presentation/contracts/validator'
import { EmailValidator } from '../../../../validation/contracts/email-validator'
import { CompareFieldsValidator, EmailFieldValidator, RequiredFieldValidator, ValidatorComposite } from '../../../../validation/validators'

const mockEmailValidator = (): EmailValidator => {
  class EmailValidatorStub implements EmailValidator {
    isEmail (email: string): boolean {
      return true
    }
  }
  return new EmailValidatorStub()
}

jest.mock('../../../../validation/validators/validator-composite')

describe('Signup Validation Factory', () => {
  test('Should call ValidatorComposite with all validators', () => {
    SignupValidationFactory()
    const validators: Validator[] = []
    const requiredFields = ['name', 'email', 'password', 'confirmation']
    for (const field of requiredFields) {
      validators.push(new RequiredFieldValidator(field))
    }
    validators.push(new EmailFieldValidator('email', mockEmailValidator()))
    validators.push(new CompareFieldsValidator('password', 'confirmation'))
    expect(ValidatorComposite).toHaveBeenCalledWith(validators)
  })
})
