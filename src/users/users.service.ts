import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { User } from './entity/user.entity';
import * as bcrypt from 'bcrypt';
import { UnauthorizedException } from '@nestjs/common/exceptions';
import { JwtService } from '@nestjs/jwt';
import { SignUpCredentialsDto } from './dto/sign-up-credentials.dto';
import { SignInCredentialsDto } from './dto/sign-in-credentials.dto';
import { IToken } from './types';

@Injectable()
export class UsersService extends Repository<User> {
  constructor(private dataSource: DataSource, private jwtService: JwtService) {
    super(User, dataSource.createEntityManager());
  }

  async generateToken(user: User): Promise<IToken> {
    const payload = { email: user.email };

    const accessToken = await this.jwtService.sign(payload, {
      expiresIn: '1d',
    });

    const response: IToken = {
      name: user.name,
      token: `Bearer ${accessToken}`,
    };

    return response;
  }

  async createUser(
    signUpCredentialsDto: SignUpCredentialsDto,
  ): Promise<IToken> {
    const { name, email, password } = signUpCredentialsDto;

    // generate salt for password
    const salt = await bcrypt.genSalt(10);

    // hash password
    const hashedPassword = await bcrypt.hash(password, salt);

    const user = this.create({ name, email, password: hashedPassword });

    try {
      await this.save(user);

      return this.generateToken(user);
    } catch (error) {
      if (error.code === '23505') {
        throw new ConflictException('Username already exist');
      } else {
        throw new InternalServerErrorException();
      }
    }
  }

  async signIn(signInCredentialsDto: SignInCredentialsDto): Promise<IToken> {
    const { email, password } = signInCredentialsDto;

    const user = await this.findOneBy({ email });

    if (user && (await bcrypt.compare(password, user.password))) {
      return this.generateToken(user);
    } else {
      throw new UnauthorizedException('Please check your login credentials');
    }
  }

  async validate(user: User) {
    const found = await this.findOneBy({ email: user.email });

    if (found) {
      return this.generateToken(found);
    } else {
      throw new UnauthorizedException('json web token invalid');
    }
  }
}
