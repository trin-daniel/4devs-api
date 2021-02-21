import { AuthenticationDTO } from '@Application/DTOS/Authentication-DTO'

export interface AuthenticationUseCase {
   Auth (data: AuthenticationDTO): Promise<string>
}
