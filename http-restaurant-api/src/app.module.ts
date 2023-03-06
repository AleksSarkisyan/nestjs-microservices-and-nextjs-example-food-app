import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { RestaurantModule } from './restaurant/restaurant.module';
import { UserModule } from './user/user.module';
import { MenuModule } from './menu/menu.module';

@Module({
  imports: [RestaurantModule, UserModule, MenuModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }