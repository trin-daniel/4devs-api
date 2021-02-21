import { Validation } from '@Presentation/Protocols/Validation'
import { MissingParamError } from '@Presentation/Errors'

export class RequiredFieldValidator implements Validation {
  constructor (
    private readonly FieldName: string
  ) {}

  Validate (input: {[key: string]: any}): Error | null {
    return !input[this.FieldName]
      ? new MissingParamError(this.FieldName)
      : null
  }
}
