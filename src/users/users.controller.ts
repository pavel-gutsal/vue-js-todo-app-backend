import { Body, Controller, Post, UseGuards, Get } from '@nestjs/common';
import { UsersService } from './users.service';
import { SignUpCredentialsDto } from './dto/sign-up-credentials.dto';
import { SignInCredentialsDto } from './dto/sign-in-credentials.dto';
import { IToken } from './types';
import { AuthGuard } from '@nestjs/passport';
import { GetUser } from './get-user.decorator';
import { User } from './entity/user.entity';

@Controller('user')
export class UsersController {
  constructor(private usersService: UsersService) {}

  @Post('/signup')
  signUp(@Body() signUpCredentialsDto: SignUpCredentialsDto): Promise<IToken> {
    return this.usersService.createUser(signUpCredentialsDto);
  }

  @Post('/signin')
  signIn(@Body() signInCredentialsDto: SignInCredentialsDto): Promise<IToken> {
    return this.usersService.signIn(signInCredentialsDto);
  }

  @Get('/validate')
  @UseGuards(AuthGuard())
  validate(@GetUser() user: User): Promise<IToken> {
    return this.usersService.validate(user);
  }
}
