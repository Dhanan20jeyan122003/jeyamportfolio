import { Client } from 'pg';
import * as dotenv from 'dotenv';
import * as fs from 'fs';
import * as path from 'path';
const pdfParse = require('pdf-parse');

dotenv.config({ path: path.join(__dirname, '../.env') });

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

async function embedResume() {
  await client.connect();
  console.log('Connected to DB');

  try {
    // 1. Delete old resume embeddings so we don't have duplicates
    console.log('Clearing old resume knowledge...');
    await client.query("DELETE FROM content_embeddings WHERE source_table = 'resume'");

    // 2. Read the new PDF
    const pdfPath = path.join(__dirname, '../Resume_.pdf');
    const dataBuffer = fs.readFileSync(pdfPath);

    console.log('Parsing PDF...');
    const data = await pdfParse(dataBuffer);

    // Clean and split the text into manageable chunks
    const rawText = data.text.replace(/\n\s*\n/g, '\n').trim();
    const chunks = rawText.split('  ').map(c => c.trim()).filter(c => c.length > 20); // Basic chunking

    console.log(`Found ${chunks.length} chunks of text in the resume.`);

    // Wait, let's just make slightly larger chunks so context isn't lost. 
    // We can group sentences.
    const sentences = rawText.replace(/\n/g, ' ').split(/(?<=\.|\?|\!)\s/);
    const combinedChunks = [];
    let currentChunk = '';

    for (const sentence of sentences) {
      if (currentChunk.length + sentence.length > 400) {
        combinedChunks.push(currentChunk.trim());
        currentChunk = sentence;
      } else {
        currentChunk += ' ' + sentence;
      }
    }
    if (currentChunk.trim().length > 0) {
      combinedChunks.push(currentChunk.trim());
    }

    console.log(`Created ${combinedChunks.length} logical chunks from the resume.`);

    let insertedCount = 0;

    for (let i = 0; i < combinedChunks.length; i++) {
      const chunk = combinedChunks[i];
      const text = `Dhananjeyan's Resume info: ${chunk}`;

      try {
        const embedding = await generateEmbedding(text);

        await client.query(
          'INSERT INTO content_embeddings (source_table, source_id, content_text, embedding) VALUES ($1, $2, $3, $4::vector)',
          ['resume', '00000000-0000-0000-0000-000000000000', text, `[${embedding.join(',')}]`]
        );
        insertedCount++;
        console.log(`Embedded chunk ${i + 1}/${combinedChunks.length}`);
      } catch (err) {
        console.log(`Failed to embed chunk ${i + 1}:`, err);
      }
    }

    console.log(`Successfully embedded ${insertedCount} resume chunks.`);
  } catch (err) {
    console.error('Embedding resume failed:', err);
  } finally {
    await client.end();
  }
}

embedResume();
