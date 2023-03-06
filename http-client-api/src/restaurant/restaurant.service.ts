import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';
import { LoginUser } from 'src/user/dto/login-user';
import { CreateMenuDto } from './dto/create-menu.';
import { CreateRestaurantUserDto } from './dto/create-restaurant-user.dto';
import { CreateRestaurantDto } from './dto/create-restaurant.dto';

@Injectable()
export class RestaurantService {
  constructor(@Inject('RESTAURANT_SERVICE') public client: ClientProxy) { }

  async create(createRestaurantUserDto: CreateRestaurantUserDto) {
    let message = this.client.send({ cmd: 'createRestaurantUser' }, createRestaurantUserDto);

    return await firstValueFrom(message);
  }

  async createRestaurant(createRestaurantDto: CreateRestaurantDto) {
    let message = this.client.send({ cmd: 'createRestaurant' }, createRestaurantDto);

    return await firstValueFrom(message);
  }

  async createMenu(createMenuDto: CreateMenuDto) {
    console.log('createMenuDto is', createMenuDto)
    let message = this.client.send({ cmd: 'createMenu' }, createMenuDto);

    return await firstValueFrom(message);
  }

  async login(loginParams: LoginUser) {
    let message = this.client.send({ cmd: 'loginRestaurantUser' }, loginParams);

    return await firstValueFrom(message);
  }
}
