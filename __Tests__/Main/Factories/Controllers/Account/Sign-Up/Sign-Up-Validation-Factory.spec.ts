import { Validation } from '@Presentation/Protocols/Validation'
import { SignUpValidationFactory } from '@Main/Factories/Controllers/Account/Sign-Up/Sign-Up-Validation-Factory'
import { CompareFieldsValidation, EmailFieldValidation, RequiredFieldValidator, ValidationComposite } from '@Validation/Components'

jest.mock('@Validation/Components/Validation-Composite')

describe('SignUp Validation Factory', () => {
  test('Should call ValidationComposite with all validations', () => {
    SignUpValidationFactory()
    const Validations: Validation[] = []
    const RequiredFields = ['name', 'email', 'password', 'confirmation']
    for (const field of RequiredFields) {
      Validations.push(new RequiredFieldValidator(field))
    }
    Validations.push(
      new EmailFieldValidation('email')
    )
    Validations.push(
      new CompareFieldsValidation('password', 'confirmation')
    )
    expect(ValidationComposite).toHaveBeenCalledWith(Validations)
  })
})
