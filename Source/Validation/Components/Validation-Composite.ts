import { Validation } from '@Presentation/Protocols/Validation'

export class ValidationComposite implements Validation {
  constructor (
    private readonly Validations: Validation[]
  ) {}

  Validate (input: { [key: string]: any; }): Error {
    for (const Validation of this.Validations) {
      const Error = Validation.Validate(input)
      if (Error) return Error
    }
    return null
  }
}
