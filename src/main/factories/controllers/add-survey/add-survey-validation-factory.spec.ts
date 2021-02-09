import { AddSurveyValidationFactory } from './add-survey-validation-factory'
import { Validator } from '../../../../presentation/contracts/validator'
import { RequiredFieldValidator, ValidatorComposite } from '../../../../validation/validators'

jest.mock('../../../../validation/validators/validator-composite')

describe('Add Survey Validation Factory', () => {
  test('Should call ValidatorComposite with all validators', () => {
    AddSurveyValidationFactory()
    const validators: Validator[] = []
    validators.push(new RequiredFieldValidator('question'))
    validators.push(new RequiredFieldValidator('answers'))
    expect(ValidatorComposite).toHaveBeenCalledWith(validators)
  })
})
