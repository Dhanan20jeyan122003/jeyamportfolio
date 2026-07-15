import { Client } from 'pg';
import * as dotenv from 'dotenv';
dotenv.config();

const connectionString = process.env.DATABASE_URL as string;
const OLLAMA_URL = 'http://192.168.1.16:11434';
const EMBED_MODEL = 'nomic-embed-text';

const client = new Client({
  connectionString,
});

async function generateEmbedding(text: string): Promise<number[]> {
  const response = await fetch(`${OLLAMA_URL}/api/embeddings`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      model: EMBED_MODEL,
      prompt: text
    })
  });
  
  if (!response.ok) {
    throw new Error(`Ollama embedding failed: ${response.statusText}`);
  }
  
  const data = await response.json();
  return data.embedding;
}

async function embed() {
  await client.connect();
  console.log('Connected to DB');

  try {
    // Clear existing embeddings
    await client.query('TRUNCATE content_embeddings RESTART IDENTITY CASCADE;');

    // Embed Profile
    const profileRes = await client.query('SELECT * FROM profile LIMIT 1');
    if (profileRes.rows.length > 0) {
      const p = profileRes.rows[0];
      const text = `Profile of ${p.name}. Tagline: ${p.tagline}. Bio: ${p.bio}.`;
      const embedding = await generateEmbedding(text);
      await client.query(
        'INSERT INTO content_embeddings (source_table, source_id, content_text, embedding) VALUES ($1, $2, $3, $4::vector)',
        ['profile', p.id, text, `[${embedding.join(',')}]`]
      );
      console.log('Embedded profile');
    }

    // Embed Projects
    const projectsRes = await client.query('SELECT * FROM projects');
    for (const p of projectsRes.rows) {
      const text = `Project title: ${p.title}. Description: ${p.description}. Tech stack: ${p.tech_stack.join(', ')}.`;
      const embedding = await generateEmbedding(text);
      await client.query(
        'INSERT INTO content_embeddings (source_table, source_id, content_text, embedding) VALUES ($1, $2, $3, $4::vector)',
        ['projects', p.id, text, `[${embedding.join(',')}]`]
      );
    }
    console.log(`Embedded ${projectsRes.rows.length} projects`);

    // Embed Experience
    const expRes = await client.query('SELECT * FROM experience');
    for (const e of expRes.rows) {
      const text = `Experience at ${e.company} as ${e.role} from ${e.start_date} to ${e.end_date}. Description: ${e.description}. Highlights: ${e.highlights.join(', ')}.`;
      const embedding = await generateEmbedding(text);
      await client.query(
        'INSERT INTO content_embeddings (source_table, source_id, content_text, embedding) VALUES ($1, $2, $3, $4::vector)',
        ['experience', e.id, text, `[${embedding.join(',')}]`]
      );
    }
    console.log(`Embedded ${expRes.rows.length} experiences`);

    // Embed Skills
    const skillsRes = await client.query('SELECT * FROM skills');
    for (const s of skillsRes.rows) {
      const text = `Skill: ${s.name}, Category: ${s.category}, Proficiency: ${s.proficiency} out of 100.`;
      const embedding = await generateEmbedding(text);
      await client.query(
        'INSERT INTO content_embeddings (source_table, source_id, content_text, embedding) VALUES ($1, $2, $3, $4::vector)',
        ['skills', s.id, text, `[${embedding.join(',')}]`]
      );
    }
    console.log(`Embedded ${skillsRes.rows.length} skills`);

    console.log('Embedding completed successfully.');
  } catch (err) {
    console.error('Embedding failed:', err);
  } finally {
    await client.end();
  }
}

embed();
