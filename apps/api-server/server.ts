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
const GROQ_API_KEY = process.env.GROQ_API_KEY as string;
const COHERE_API_KEY = process.env.COHERE_API_KEY as string;
const CHAT_MODEL = 'llama-3.1-8b-instant'; // Groq
const EMBED_MODEL = 'embed-english-v3.0'; // Cohere

const client = new Client({ connectionString });
client.connect().catch(err => console.error('DB connection error', err));

async function generateEmbedding(text: string, inputType: 'search_document' | 'search_query' = 'search_query'): Promise<number[]> {
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
      input_type: inputType
    })
  });
  if (!response.ok) throw new Error('Cohere embedding failed');
  const data = await response.json();
  return data.embeddings[0];
}

app.get('/api/health', async (req, res) => {
  try {
    await client.query('SELECT 1');
    res.status(200).json({ status: 'healthy', message: 'Render and Supabase are awake!' });
  } catch (error) {
    console.error('Health check failed', error);
    res.status(500).json({ status: 'error', message: 'Database connection failed' });
  }
});

app.post('/api/chat', async (req, res) => {
  const { query, history, sessionId } = req.body;
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

    // 4. Stream response from Groq
    const groqRes = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: { 
        'Authorization': `Bearer ${GROQ_API_KEY}`,
        'Content-Type': 'application/json' 
      },
      body: JSON.stringify({
        model: CHAT_MODEL,
        messages: [
          { role: 'system', content: systemPrompt },
          ...(history || []).map((m: any) => ({
            role: m.role === 'ai' ? 'assistant' : m.role,
            content: m.content
          })),
          { role: 'user', content: query }
        ],
        stream: true
      })
    });

    if (!groqRes.ok) throw new Error('Groq chat failed');
    if (!groqRes.body) throw new Error('No body in Groq response');

    const reader = groqRes.body.getReader();
    const decoder = new TextDecoder();
    let fullResponse = '';

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      const chunk = decoder.decode(value, { stream: true });
      const lines = chunk.split('\n').filter(l => l.trim() !== '' && l.trim() !== 'data: [DONE]');
      for (const line of lines) {
        if (line.startsWith('data: ')) {
          try {
            const json = JSON.parse(line.substring(6));
            if (json.choices && json.choices[0].delta && json.choices[0].delta.content) {
              const content = json.choices[0].delta.content;
              fullResponse += content;
              res.write(`data: ${JSON.stringify({ content })}\n\n`);
            }
          } catch (e) {
            // ignore JSON parse errors on incomplete chunks
          }
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
