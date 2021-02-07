import { Validator } from '../../../../presentation/contracts/validator'
import { EmailValidatorAdapter } from '../../../../infra/adapters/validators/email-validator-adapter'
import { CompareFieldsValidator, EmailFieldValidator, RequiredFieldValidator, ValidatorComposite } from '../../../../validation/validators'

export const signupValidationFactory = (): Validator => {
  const validators: Validator[] = []
  const requiredFields = ['name', 'email', 'password', 'confirmation']
  for (const field of requiredFields) {
    validators.push(new RequiredFieldValidator(field))
  }
  validators.push(new EmailFieldValidator('email', new EmailValidatorAdapter()))
  validators.push(new CompareFieldsValidator('password', 'confirmation'))
  return new ValidatorComposite(validators)
}
