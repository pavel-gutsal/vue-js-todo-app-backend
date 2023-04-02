import {
  IsString,
  IsNotEmpty,
  MinLength,
  MaxLength,
  Matches,
  IsEmail,
} from 'class-validator';

// eslint-disable-next-line prettier/prettier
const passwordRegex = /^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])([a-zA-Z0-9]{6,})$/;

export class SignUpCredentialsDto {
  @IsNotEmpty()
  @IsString()
  @MinLength(2, {
    message: 'name is too short. Minimum length is 2 characters',
  })
  @MaxLength(40, {
    message: 'name is too long. Maximal length is 40 characters',
  })
  name: string;

  @IsNotEmpty()
  @IsString()
  @IsEmail()
  email: string;

  @IsNotEmpty()
  @MinLength(6, {
    message: 'Password is too short. Minimum length is 6 characters',
  })
  @Matches(passwordRegex, {
    message: 'Password must contain at least 1 number, 1 UpperCaseLater',
  })
  password: string;
}
