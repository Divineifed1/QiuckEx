import { Controller, Get } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

import { HealthService } from './health.service';
import { HealthResponseDto } from './health-response.dto';
import { ReadinessResponseDto } from 'src/health/readiness-response.dto';

@ApiTags('health')
@Controller('health')
export class HealthController {
  constructor(private readonly healthService: HealthService) {}

  /**
   * Liveness probe
   */
  @Get()
  @ApiOperation({
    summary: 'Health check (liveness)',
    description:
      'Returns basic liveness information. Use this to verify the service process is running.',
  })
  @ApiResponse({
    status: 200,
    description: 'Service is alive',
    type: HealthResponseDto,
  })
  getHealth(): HealthResponseDto {
    return this.healthService.liveness();
  }

  /**
   * Readiness probe
   */
  @Get('ready')
  @ApiOperation({
    summary: 'Readiness check',
    description:
      'Checks whether the service is ready to receive traffic. Includes dependency and env validation.',
  })
  @ApiResponse({
    status: 200,
    description: 'Readiness status (never throws)',
    type: ReadinessResponseDto,
  })
  readiness(): Promise<ReadinessResponseDto> {
    return this.healthService.readiness();
  }
}
