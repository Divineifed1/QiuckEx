import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

/**
 * Health check response DTO
 */
export class HealthResponseDto {
  @ApiProperty({
    description: 'Health status of the service',
    example: 'ok',
    enum: ['ok'],
  })
  status!: 'ok';

  @ApiPropertyOptional({
    example: 12345,
    description: 'Uptime in seconds',
  })
  uptime?: number;

  @ApiPropertyOptional({
    description: 'Application version',
    example: '1.0.0',
  })
  version?: string;
}
