import { ApiProperty } from '@nestjs/swagger';

class ReadinessCheckDto {
  @ApiProperty({ example: 'supabase' })
  name: string;

  @ApiProperty({ example: 'ok', enum: ['ok', 'degraded'] })
  status: 'ok' | 'degraded';

  @ApiProperty({ example: 'timeout', required: false })
  error?: string;
}

export class ReadinessResponseDto {
  @ApiProperty({ example: true })
  ready: boolean;

  @ApiProperty({ type: [ReadinessCheckDto] })
  checks: ReadinessCheckDto[];
}
