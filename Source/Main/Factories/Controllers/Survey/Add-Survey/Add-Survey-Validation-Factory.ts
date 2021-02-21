import { Validation } from '@Presentation/Protocols'
import { RequiredFieldValidator, ValidationComposite } from '@Validation/Components'

export const AddSurveyValidationFactory = (): Validation => {
  const Validations: Validation[] = []
  Validations.push(new RequiredFieldValidator('question'))
  Validations.push(new RequiredFieldValidator('answers'))
  return new ValidationComposite(Validations)
}
