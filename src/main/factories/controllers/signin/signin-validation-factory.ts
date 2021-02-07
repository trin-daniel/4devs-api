import { Validator } from '../../../../presentation/contracts'
import { EmailValidatorAdapter } from '../../../../infra/adapters/validators/email-validator-adapter'
import { EmailFieldValidator, RequiredFieldValidator, ValidatorComposite } from '../../../../validation/validators'

export const SigninValidationFactory = (): Validator => {
  const validators: Validator[] = []
  const requiredFields = ['email', 'password']
  for (const field of requiredFields) {
    validators.push(new RequiredFieldValidator(field))
  }
  validators.push(new EmailFieldValidator('email', new EmailValidatorAdapter()))
  return new ValidatorComposite(validators)
}
