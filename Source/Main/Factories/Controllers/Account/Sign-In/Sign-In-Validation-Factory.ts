import { Validation } from '@Presentation/Protocols'
import { EmailFieldValidation, RequiredFieldValidator, ValidationComposite } from '@Validation/Components'

export const SignInValidationFactory = (): Validation => {
  const Validations: Validation[] = []
  const RequiredFields = ['email', 'password']
  for (const Field of RequiredFields) {
    Validations.push(new RequiredFieldValidator(Field))
  }
  Validations.push(new EmailFieldValidation('email'))
  return new ValidationComposite(Validations)
}
