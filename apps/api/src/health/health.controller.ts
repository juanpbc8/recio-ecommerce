import { Controller, Get } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('Health')
@Controller('health')
export class HealthController {
  @Get()
  @ApiOperation({ summary: 'Verificar estado del API' })
  @ApiResponse({ status: 200, description: 'API funcionando correctamente' })
  check() {
    return {
      status: 'ok',
      timestamp: new Date().toISOString(),
      service: 'recio-ecommerce-api',
      version: '1.0.0',
    };
  }
}
