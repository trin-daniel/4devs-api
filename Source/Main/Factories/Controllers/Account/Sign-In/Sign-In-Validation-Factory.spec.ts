import { SignInValidationFactory } from '@Main/Factories/Controllers/Account/Sign-In/Sign-In-Validation-Factory'
import { Validation } from '@Presentation/Protocols'
import { EmailFieldValidation, RequiredFieldValidator, ValidationComposite } from '@Validation/Components'

jest.mock('@Validation/Components/Validation-Composite')

describe('SignIn Validation Factory', () => {
  test('Should call ValidationComposite with all validations', () => {
    SignInValidationFactory()
    const Validations: Validation[] = []
    const RequiredFields = ['email', 'password']
    for (const Field of RequiredFields) {
      Validations.push(new RequiredFieldValidator(Field))
    }
    Validations.push(new EmailFieldValidation('email'))
    expect(ValidationComposite).toHaveBeenCalledWith(Validations)
  })
})
