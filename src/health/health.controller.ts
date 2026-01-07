import { Body, Controller, Get, Post } from '@nestjs/common';
import { EchoDto } from './dto/echo.dto';

@Controller('health')
export class HealthController {
  @Get()
  ok() {
    return { ok: true };
  }

  @Post('echo')
  echo(@Body() body: EchoDto) {
    return body;
  }
}
