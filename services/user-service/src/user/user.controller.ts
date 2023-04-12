import { Controller, UsePipes, UseFilters, Logger } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { UserService } from './user.service';
import { LocalStrategy } from './strategies/local.strategy';
import { Enums, Filters, Types } from '@asarkisyan/nestjs-foodapp-shared';
import { JoiValidationPipe } from 'src/shared/pipes/joi-validation-pipe';


@Controller()
export class UserController {
  constructor(
    private readonly userService: UserService,
    private readonly localStrategy: LocalStrategy) { }

  @UseFilters(new Filters.ExceptionFilter())
  @MessagePattern({ cmd: Enums.User.Commands.CREATE_USER })
  @UsePipes(new JoiValidationPipe(Types.User.createUserSchema))
  /** Creates user and issues access token */
  async create(@Payload() createUserDto: Types.User.CreateUserDto) {
    let user = await this.userService.create(createUserDto);
    let shouldLogin = await this.localStrategy.validate(user.email, user.password);
    let { email, password, name } = user;

    if (shouldLogin) {
      let tokenData: Types.User.LoginUser = {
        email,
        password
      }

      let token = await this.userService.login(tokenData);

      return {
        user: {
          name,
          email
        },
        token,
        error: null
      };
    }

    return {
      user: {
        name,
        email
      },
      error: Enums.User.Messages.TOKEN_ERROR
    }
  }

  @UseFilters(new Filters.ExceptionFilter())
  @MessagePattern({ cmd: Enums.User.Commands.LOGIN_USER })
  @UsePipes(new JoiValidationPipe(Types.User.loginUserSchema))
  async login(@Payload() loginUserDto: Types.User.LoginUser) {
    let user = await this.localStrategy.validate(loginUserDto.email, loginUserDto.password);

    if (user) {
      let token = await this.userService.login(loginUserDto);
      let { email, name } = user;

      return {
        user: {
          name,
          email
        },
        token,
        error: null
      };
    }

    return {
      error: Enums.User.Messages.LOGIN_ERROR
    }
  }

  @UseFilters(new Filters.ExceptionFilter())
  @MessagePattern({ cmd: Enums.User.Commands.IS_LOGGED_IN })
  @UsePipes(new JoiValidationPipe(Types.User.isLoggedInSchema))
  async isLoggedIn(data: Types.User.IsLoggedIn) {
    try {
      return this.userService.validateToken(data.jwt);
    } catch (e) {
      console.log(Enums.User.Messages.TOKEN_VALIDATION_ERROR, e);
      Logger.log(e);
      return false;
    }
  }

  @UseFilters(new Filters.ExceptionFilter())
  @MessagePattern({ cmd: Enums.User.Commands.GET_USER_FROM_TOKEN })
  @UsePipes(new JoiValidationPipe(Types.User.getUserFromTokenSchema))
  async getUserFromToken(data: Types.User.GetUserFromToken) {
    try {
      return this.userService.getUserFromToken(data.token);
    } catch (e) {
      console.log(Enums.User.Messages.TOKEN_VALIDATION_ERROR, e);
      Logger.log(e);
      return false;
    }
  }
}