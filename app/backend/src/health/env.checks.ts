export async function checkEnv() {
  try {
    const requiredVars = [
      'SUPABASE_URL',
      'SUPABASE_SERVICE_ROLE_KEY',
    ];

    const missing = requiredVars.filter(
      (key) => !process.env[key] || process.env[key]?.length === 0,
    );

    if (missing.length > 0) {
      return {
        name: 'env',
        status: 'degraded' as const,
        error: `Missing env vars: ${missing.join(', ')}`,
      };
    }

    return {
      name: 'env',
      status: 'ok' as const,
    };
  } catch (err: any) {
    // absolute safety: never throw
    return {
      name: 'env',
      status: 'degraded' as const,
      error: err?.message ?? 'env check failed',
    };
  }
}
