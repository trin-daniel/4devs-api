import { Validator } from '@presentation/contracts/validator'

export class ValidatorComposite implements Validator {
  constructor (
    private readonly validators: Validator[]
  ) {}

  validate (input: { [key: string]: any; }): Error {
    for (const validator of this.validators) {
      const error = validator.validate(input)
      if (error) return error
    }
    return null
  }
}
