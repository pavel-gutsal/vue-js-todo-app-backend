import { IsString, IsEmail, IsNotEmpty } from 'class-validator';

export class SignInCredentialsDto {
  @IsNotEmpty()
  @IsString()
  @IsEmail()
  email: string;

  @IsNotEmpty()
  @IsString()
  password: string;
}
