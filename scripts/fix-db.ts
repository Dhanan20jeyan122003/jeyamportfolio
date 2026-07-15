import { Client } from 'pg';
import * as dotenv from 'dotenv';
dotenv.config();

const connectionString = process.env.DATABASE_URL as string;

async function fixDb() {
  const client = new Client({ connectionString });
  
  try {
    await client.connect();
    console.log('Connected to DB for fixing schema');
    
    await client.query(`
      DROP FUNCTION IF EXISTS match_content;
      DROP TABLE IF EXISTS content_embeddings;

      CREATE TABLE content_embeddings (
        id BIGSERIAL PRIMARY KEY,
        source_table TEXT,
        source_id UUID,
        content_text TEXT,
        embedding VECTOR(768)
      );

      CREATE FUNCTION match_content (
        query_embedding vector(768),
        match_threshold float,
        match_count int
      )
      RETURNS TABLE (
        id bigint,
        content_text text,
        similarity float
      )
      LANGUAGE plpgsql
      AS $$
      BEGIN
        RETURN QUERY
        SELECT
          content_embeddings.id,
          content_embeddings.content_text,
          1 - (content_embeddings.embedding <=> query_embedding) AS similarity
        FROM content_embeddings
        WHERE 1 - (content_embeddings.embedding <=> query_embedding) > match_threshold
        ORDER BY content_embeddings.embedding <=> query_embedding
        LIMIT match_count;
      END;
      $$;
    `);
    
    console.log('Successfully updated DB schema for 768 dimension vectors!');
  } catch (error) {
    console.error('Failed to fix DB:', error);
  } finally {
    await client.end();
  }
}

fixDb();
