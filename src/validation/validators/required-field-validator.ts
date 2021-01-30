import { Validator } from '../../presentation/contracts/validator'
import { MissingParamError } from '../../presentation/errors'

export class RequiredFieldValidator implements Validator {
  constructor (
    private readonly fieldName: string
  ) {}

  validate (input: {[key: string]: any}): Error | null {
    return !input[this.fieldName]
      ? new MissingParamError(this.fieldName)
      : null
  }
}
