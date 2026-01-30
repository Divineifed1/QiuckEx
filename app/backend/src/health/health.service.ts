import { Injectable } from '@nestjs/common';
import { checkEnv } from './env.checks';
import { HealthResponseDto } from './health-response.dto';
import { checkSupabase } from 'src/supabase/checks/supabase.check';

const TIMEOUT_MS = 1500;

@Injectable()
export class HealthService {
  private readonly startedAt = Date.now();

  liveness(): HealthResponseDto {
    return {
      status: 'ok',
      version: process.env.APP_VERSION ?? undefined,
      uptime: Math.floor((Date.now() - this.startedAt) / 1000),
    };
  }

  async readiness() {
    const checks = await Promise.allSettled([
      withTimeout(checkEnv(), TIMEOUT_MS),
      withTimeout(checkSupabase(), TIMEOUT_MS),
    ]);

    const mapped = checks.map(mapResult);
    const ready = mapped.every((c) => c.status === 'ok');

    return { ready, checks: mapped };
  }
}

/* helpers */

function withTimeout<T>(promise: Promise<T>, ms: number): Promise<T> {
  return new Promise((resolve, reject) => {
    const t = setTimeout(() => reject(new Error('timeout')), ms);
    promise
      .then((r) => {
        clearTimeout(t);
        resolve(r);
      })
      .catch((e) => {
        clearTimeout(t);
        reject(e);
      });
  });
}

function mapResult(result: PromiseSettledResult<any>) {
  if (result.status === 'fulfilled') return result.value;

  return {
    name: 'unknown',
    status: 'degraded',
    error: result.reason?.message ?? 'failed',
  };
}
