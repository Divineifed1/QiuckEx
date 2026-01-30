import { createClient } from '@supabase/supabase-js';

export async function checkSupabase() {
  try {
    if (!process.env.SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
      return {
        name: 'supabase',
        status: 'degraded' as const,
        error: 'Supabase env not configured',
      };
    }

    const supabase = createClient(
      process.env.SUPABASE_URL,
      process.env.SUPABASE_SERVICE_ROLE_KEY,
      {
        auth: { persistSession: false },
        global: { fetch },
      },
    );

    /**
     * Lightweight ping:
     * - no table scan
     * - no auth mutation
     * - minimal latency
     */
    const { error } = await supabase
      .from('pg_catalog.pg_tables')
      .select('tablename')
      .limit(1);

    if (error) {
      throw error;
    }

    return {
      name: 'supabase',
      status: 'ok' as const,
    };
  } catch (err: any) {
    return {
      name: 'supabase',
      status: 'degraded' as const,
      error: err?.message ?? 'Supabase unreachable',
    };
  }
}
