import { Validation } from '@Presentation/Protocols/Validation'
import { CompareFieldsValidation, EmailFieldValidation, RequiredFieldValidator, ValidationComposite } from '@Validation/Components'

export const SignUpValidationFactory = (): Validation => {
  const Validations: Validation[] = []
  const RequiredFields = ['name', 'email', 'password', 'confirmation']
  for (const Field of RequiredFields) {
    Validations.push(
      new RequiredFieldValidator(Field)
    )
  }
  Validations.push(
    new EmailFieldValidation('email')
  )
  Validations.push(
    new CompareFieldsValidation('password', 'confirmation')
  )
  return new ValidationComposite(Validations)
}
