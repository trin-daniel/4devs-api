import { Validator } from '@presentation/contracts/validator'
import { InvalidParamError } from '@presentation/errors'

export class CompareFieldsValidator implements Validator {
  constructor (
    private readonly fieldName: string,
    private readonly fieldToCompareName: string
  ) {}

  validate (input: {[key: string]: any}): Error | null {
    return input[this.fieldName] !== input[this.fieldToCompareName]
      ? new InvalidParamError(this.fieldToCompareName)
      : null
  }
}
