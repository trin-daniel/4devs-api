import { AuthenticationDTO } from '../../dtos/authentication-dto'

export interface Authentication {
   auth (data: AuthenticationDTO): Promise<string>
}
