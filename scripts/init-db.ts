import { Client } from 'pg';
import * as fs from 'fs';
import * as path from 'path';

const connectionString = 'postgresql://postgres.bblbdodziysbvlisupzx:jeyamportfoliodb@aws-0-ap-northeast-1.pooler.supabase.com:6543/postgres';

async function initDb() {
  const client = new Client({
    connectionString,
    ssl: { rejectUnauthorized: false }
  });

  try {
    await client.connect();
    console.log('Connected to DB');
    
    const schemaPath = path.join(__dirname, '../lib/db/schema.sql');
    const sql = fs.readFileSync(schemaPath, 'utf-8');
    
    console.log('Applying schema...');
    await client.query(sql);
    console.log('Schema applied successfully!');
  } catch (error) {
    console.error('Failed to apply schema:', error);
  } finally {
    await client.end();
  }
}

initDb();
