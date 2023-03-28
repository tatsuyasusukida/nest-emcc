import {
  Body,
  Controller,
  HttpCode,
  Post,
  StreamableFile,
} from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Post()
  @HttpCode(200)
  convertToWasm(@Body('source') source: string): Promise<StreamableFile> {
    return this.appService.convertToWasm(source);
  }
}
