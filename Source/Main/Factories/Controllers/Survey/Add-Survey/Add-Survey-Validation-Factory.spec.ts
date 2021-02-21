import { AddSurveyValidationFactory } from '@Main/Factories/Controllers/Survey/Add-Survey/Add-Survey-Validation-Factory'
import { Validation } from '@Presentation/Protocols/Validation'
import { RequiredFieldValidator, ValidationComposite } from '@Validation/Components'

jest.mock('@Validation/Components/Validation-Composite')

describe('Add Survey Validation Factory', () => {
  test('Should call ValidationComposite with all validations', () => {
    AddSurveyValidationFactory()
    const Validations: Validation[] = []
    Validations.push(new RequiredFieldValidator('question'))
    Validations.push(new RequiredFieldValidator('answers'))
    expect(ValidationComposite).toHaveBeenCalledWith(Validations)
  })
})
