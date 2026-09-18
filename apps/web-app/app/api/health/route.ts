import { NextResponse } from 'next/server';
import { Pool } from 'pg';

let pool: Pool | null = null;

function getPool() {
  if (!pool) {
    const connectionString = process.env.DATABASE_URL;
    if (!connectionString) {
      throw new Error('DATABASE_URL is not set');
    }
    pool = new Pool({
      connectionString,
      ssl: { rejectUnauthorized: false },
      connectionTimeoutMillis: 5000,
      idleTimeoutMillis: 30000,
    });
  }
  return pool;
}

export async function GET() {
  try {
    const dbPool = getPool();
    await dbPool.query('SELECT 1');
    return NextResponse.json({ status: 'healthy', message: 'Vercel and Supabase are awake!' }, { status: 200 });
  } catch (error: any) {
    console.error('Health check failed', error);
    return NextResponse.json({ status: 'error', message: 'Database connection failed', details: error.message }, { status: 500 });
  }
}
