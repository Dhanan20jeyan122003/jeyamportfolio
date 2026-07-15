import express from 'express';
import cors from 'cors';
import * as dotenv from 'dotenv';
import { Client } from 'pg';

import path from 'path';
dotenv.config({ path: path.join(__dirname, '../../.env') });

const app = express();
const port = process.env.PORT || 4005;

app.use(cors());
app.use(express.json());

const connectionString = process.env.DATABASE_URL as string;
const OLLAMA_URL = 'http://192.168.1.16:11434';
const CHAT_MODEL = 'llama3:8b-instruct-q8_0';
const EMBED_MODEL = 'nomic-embed-text';

const client = new Client({ connectionString });
client.connect().catch(err => console.error('DB connection error', err));

async function generateEmbedding(text: string): Promise<number[]> {
  const response = await fetch(`${OLLAMA_URL}/api/embeddings`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      model: EMBED_MODEL,
      prompt: text
    })
  });
  if (!response.ok) throw new Error('Ollama embedding failed');
  const data = await response.json();
  return data.embedding;
}

app.post('/api/chat', async (req, res) => {
  const { query, sessionId } = req.body;
  if (!query) {
    return res.status(400).json({ error: 'Query is required' });
  }

  // Set up SSE headers
  res.writeHead(200, {
    'Content-Type': 'text/event-stream',
    'Cache-Control': 'no-cache',
    'Connection': 'keep-alive',
  });

  try {
    // 1. Embed query
    const queryEmbedding = await generateEmbedding(query);

    // 2. Similarity search in Supabase
    // Using match_content function created in schema.sql
    const searchRes = await client.query(
      'SELECT * FROM match_content($1::vector, 0.2, 8)',
      [`[${queryEmbedding.join(',')}]`]
    );

    const contextChunks = searchRes.rows.map(r => r.content_text);
    const contextText = contextChunks.join('\n\n');

    // 3. Construct prompt
    const systemPrompt = `You are Dhananjeyan's portfolio AI assistant. 
Answer the user's question ONLY using the provided context. 
If the answer is NOT explicitly stated in the context, you MUST say exactly: "I don't have that information." Do not guess, assume, or make up facts (like years of experience).
Be concise, friendly, and confident. 
Do NOT mention "the context" or "the provided text" in your response.

Context:
${contextText}`;

    // 4. Stream response from Ollama
    const ollamaRes = await fetch(`${OLLAMA_URL}/api/chat`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model: CHAT_MODEL,
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: query }
        ],
        stream: true
      })
    });

    if (!ollamaRes.ok) throw new Error('Ollama chat failed');
    if (!ollamaRes.body) throw new Error('No body in Ollama response');

    const reader = ollamaRes.body.getReader();
    const decoder = new TextDecoder();
    let fullResponse = '';

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      const chunk = decoder.decode(value, { stream: true });
      const lines = chunk.split('\n').filter(l => l.trim() !== '');
      for (const line of lines) {
        const json = JSON.parse(line);
        if (json.message && json.message.content) {
          const content = json.message.content;
          fullResponse += content;
          res.write(`data: ${JSON.stringify({ content })}\n\n`);
        }
      }
    }

    // 5. Save chat log
    await client.query(
      'INSERT INTO chat_logs (session_id, question, answer) VALUES ($1, $2, $3)',
      [sessionId || 'anon', query, fullResponse]
    );

    res.write('event: done\ndata: {}\n\n');
    res.end();
  } catch (error: any) {
    console.error('Chat error:', error);
    res.write(`data: ${JSON.stringify({ error: 'Sorry, I am having trouble connecting to my brain right now.' })}\n\n`);
    res.end();
  }
});

app.listen(port, () => {
  console.log(`API Server listening on port ${port}`);
});
