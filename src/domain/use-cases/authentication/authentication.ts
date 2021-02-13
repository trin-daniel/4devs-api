import { AuthenticationDTO } from '@domain/dtos/authentication-dto'

export interface Authentication {
   auth (data: AuthenticationDTO): Promise<string>
}
