import { Client } from 'pg';
import * as dotenv from 'dotenv';
import path from 'path';
dotenv.config({ path: path.join(__dirname, '../.env') });

const connectionString = process.env.DATABASE_URL as string;
const COHERE_API_KEY = process.env.COHERE_API_KEY as string;
const EMBED_MODEL = 'embed-english-v3.0';

const client = new Client({
  connectionString,
});

async function generateEmbedding(text: string): Promise<number[]> {
  const response = await fetch('https://api.cohere.ai/v1/embed', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${COHERE_API_KEY}`,
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    },
    body: JSON.stringify({
      texts: [text],
      model: EMBED_MODEL,
      input_type: 'search_document'
    })
  });
  
  if (!response.ok) {
    throw new Error(`Cohere embedding failed: ${response.statusText}`);
  }
  
  const data = await response.json();
  return data.embeddings[0];
}

async function embed() {
  await client.connect();
  console.log('Connected to DB');

  try {
    // Clear existing embeddings for DB content
    await client.query("DELETE FROM content_embeddings WHERE source_table IN ('profile', 'projects', 'experience', 'skills');");

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
    const skillsList = skillsRes.rows.map(s => `${s.name} (${s.category}, Proficiency: ${s.proficiency}/100)`).join(', ');
    const skillsText = `Dhananjeyan's complete list of skills: ${skillsList}.`;
    
    const skillsEmbedding = await generateEmbedding(skillsText);
    await client.query(
      'INSERT INTO content_embeddings (source_table, source_id, content_text, embedding) VALUES ($1, $2, $3, $4::vector)',
      ['skills', '00000000-0000-0000-0000-000000000000', skillsText, `[${skillsEmbedding.join(',')}]`]
    );
    console.log(`Embedded all ${skillsRes.rows.length} skills as a single chunk`);

    console.log('Embedding completed successfully.');
  } catch (err) {
    console.error('Embedding failed:', err);
  } finally {
    await client.end();
  }
}

embed();
