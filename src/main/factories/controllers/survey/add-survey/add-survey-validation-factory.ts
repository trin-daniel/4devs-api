import { Validator } from '../../../../../presentation/contracts'
import { RequiredFieldValidator, ValidatorComposite } from '../../../../../validation/validators'

export const AddSurveyValidationFactory = (): Validator => {
  const validators: Validator[] = []
  validators.push(new RequiredFieldValidator('question'))
  validators.push(new RequiredFieldValidator('answers'))
  return new ValidatorComposite(validators)
}
