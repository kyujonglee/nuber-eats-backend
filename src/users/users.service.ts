import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';
import {
  CreateAccountInput,
  CreateAccountOutput,
} from './dtos/create-account.dto';
import { LoginInput, LoginOutput } from './dtos/login.dto';
import { MutationOutput } from '../common/dtos/output.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private readonly users: Repository<User>,
  ) {}

  async createAccount({
    email,
    password,
    role,
  }: CreateAccountInput): Promise<CreateAccountOutput> {
    try {
      const user = await this.users.findOne({ email });
      if (user)
        return {
          ok: false,
          error: 'There is a user with that email already',
        };
      await this.users.save(this.users.create({ email, password, role }));
      return {
        ok: true,
      };
    } catch (e) {
      return {
        ok: false,
        error: "Couldn't create account",
      };
    }
  }

  async login(loginInput: LoginInput): Promise<LoginOutput> {
    try {
      const user = await this.users.findOne({ email: loginInput.email });
      if (!user) {
        return {
          ok: false,
          error: 'We cannot find a user by this email.',
        };
      }
      const passwordCorrect = await user.checkPassword(loginInput.password);
      if (!passwordCorrect) {
        return {
          ok: false,
          error: 'Wrong password',
        };
      }
      return {
        ok: true,
        token: 'lalala',
      };
    } catch (error) {
      return {
        ok: false,
        error,
      };
    }
  }
}
