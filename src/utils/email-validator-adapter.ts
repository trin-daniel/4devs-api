import { EmailValidator } from '../presentation/contracts/email-validator'

export class EmailValidatorAdapter implements EmailValidator {
  public isEmail (email: string): boolean {
    return false
  }
}
