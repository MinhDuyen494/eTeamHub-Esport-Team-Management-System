import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { Throttle } from '@nestjs/throttler';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Throttle({ default: { limit: 5, ttl: 60 } }) // 5 requests mỗi 60 giây cho route này
  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Get('test')
  test() {
    return { message: 'App controller is working!' };
  }
}
