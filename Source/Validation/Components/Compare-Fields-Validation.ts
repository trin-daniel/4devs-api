import { Validation } from '@Presentation/Protocols/Validation'
import { InvalidParamError } from '@Presentation/Errors'

export class CompareFieldsValidation implements Validation {
  constructor (
    private readonly fieldName: string,
    private readonly fieldToCompareName: string
  ) {}

  Validate (input: {[key: string]: any}): Error | null {
    return input[this.fieldName] !== input[this.fieldToCompareName]
      ? new InvalidParamError(this.fieldToCompareName)
      : null
  }
}
